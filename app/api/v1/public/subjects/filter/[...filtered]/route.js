import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(req, { params }) {
  try {
    const [courseName, semester] = params.filtered;

    // Validate parameters
    if (!courseName || !semester) {
      return NextResponse.json({ 
        error: "Missing required parameters" 
      }, { status: 400 });
    }

    // Get filtered subjects with related content counts
    const filteredSubjects = await prisma.subject.findMany({
      where: {
        course_name: decodeURIComponent(courseName),
        semester_code: decodeURIComponent(semester),
      },
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
      orderBy: {
        subject_name: 'asc'
      }
    });

    // Get total counts
    const totalCounts = await prisma.subject.aggregate({
      where: {
        course_name: decodeURIComponent(courseName),
        semester_code: decodeURIComponent(semester),
      },
      _count: {
        _all: true
      }
    });

    return NextResponse.json({
      subjects: filteredSubjects || [],
      meta: {
        total: totalCounts._count._all,
        course: decodeURIComponent(courseName),
        semester: decodeURIComponent(semester)
      }
    });

  } catch (error) {
    console.error("Error filtering subjects:", error);
    return NextResponse.json({
      error: "Error filtering subjects",
      details: error.message
    }, { status: 500 });
  }
}

// Add a HEAD method to handle preflight requests
export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD',
    },
  });
}
