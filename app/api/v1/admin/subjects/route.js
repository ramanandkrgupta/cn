import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/send-code/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const course = searchParams.get('course') || 'all';
    const sortBy = searchParams.get('sortBy') || 'name-asc';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build where clause - only add conditions if there's a search term
    const where = {
      AND: [
        search ? {
          OR: [
            { subject_name: { contains: search, mode: 'insensitive' } },
            { subject_code: { contains: search, mode: 'insensitive' } },
            { course_name: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        course !== 'all' ? { course_name: course } : {}
      ]
    };

    // Determine sort order
    let orderBy;
    switch (sortBy) {
      case 'name-desc':
        orderBy = { subject_name: 'desc' };
        break;
      case 'newest':
        orderBy = { id: 'desc' }; // MongoDB ObjectId contains timestamp
        break;
      case 'oldest':
        orderBy = { id: 'asc' };
        break;
      case 'most-content':
        orderBy = {
          videos: { _count: 'desc' }
        };
        break;
      case 'least-content':
        orderBy = {
          videos: { _count: 'asc' }
        };
        break;
      default:
        orderBy = { subject_name: 'asc' };
    }

    // Get subjects with pagination and related counts
    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        select: {
          id: true,
          subject_name: true,
          subject_code: true,
          course_name: true,
          semester_code: true,
          User: {
            select: {
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              videos: true,
              posts: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.subject.count({ where })
    ]);

    // Get course stats
    const courseStats = await prisma.subject.groupBy({
      by: ['course_name'],
      _count: {
        _all: true
      }
    });

    // Get content stats
    const contentStats = await prisma.subject.aggregate({
      _count: {
        _all: true
      }
    });

    // Simplified transformation - just pass through the counts
    const transformedSubjects = subjects.map(subject => ({
      ...subject,
      _count: {
        videos: subject._count.videos,
        posts: subject._count.posts
      }
    }));

    return NextResponse.json({
      subjects: transformedSubjects,
      stats: {
        totalSubjects: contentStats._count._all,
        totalCourses: courseStats.length,
        courseDistribution: courseStats,
        totalContent: {
          videos: await prisma.video.count(),
          posts: await prisma.post.count()
        }
      },
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json({
      error: "Error fetching subjects",
      details: error.message
    }, { status: 500 });
  }
}

// Create new subject
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Check for duplicate subject code
    const existingSubject = await prisma.subject.findFirst({
      where: {
        OR: [
          { subject_code: data.subject_code },
          {
            AND: [
              { course_name: data.course_name },
              { subject_name: data.subject_name },
              { semester_code: data.semester_code }
            ]
          }
        ]
      }
    });

    if (existingSubject) {
      return NextResponse.json({
        error: "Subject already exists"
      }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: {
        subject_name: data.subject_name,
        subject_code: data.subject_code,
        course_name: data.course_name,
        semester_code: data.semester_code,
        userId: session.user.id
      }
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json({
      error: "Error creating subject",
      details: error.message
    }, { status: 500 });
  }
}

// Update subject
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { id, ...updateData } = data;

    // Check for duplicate subject code
    const existingSubject = await prisma.subject.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { subject_code: updateData.subject_code },
              {
                AND: [
                  { course_name: updateData.course_name },
                  { subject_name: updateData.subject_name },
                  { semester_code: updateData.semester_code }
                ]
              }
            ]
          }
        ]
      }
    });

    if (existingSubject) {
      return NextResponse.json({
        error: "Subject already exists"
      }, { status: 400 });
    }

    const subject = await prisma.subject.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Error updating subject:", error);
    return NextResponse.json({
      error: "Error updating subject",
      details: error.message
    }, { status: 500 });
  }
}

// Delete subject
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId');

    // Check if subject has related content
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        _count: {
          select: {
            posts: true,
            videos: true
          }
        }
      }
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    if (subject._count.posts > 0 || subject._count.videos > 0) {
      return NextResponse.json({
        error: "Cannot delete subject with existing content"
      }, { status: 400 });
    }

    await prisma.subject.delete({
      where: { id: subjectId }
    });

    return NextResponse.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json({
      error: "Error deleting subject",
      details: error.message
    }, { status: 500 });
  }
} 