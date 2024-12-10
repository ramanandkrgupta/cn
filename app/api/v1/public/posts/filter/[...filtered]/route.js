import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(req, { params }) {
  try {
    const [courseName, semester, category, subjectCode] = params.filtered;

    // Validate parameters
    if (!courseName || !semester || !category || !subjectCode) {
      return NextResponse.json({ 
        error: "Missing required parameters" 
      }, { status: 400 });
    }

    // Get filtered posts with related data
    const posts = await prisma.post.findMany({
      where: {
        course_name: decodeURIComponent(courseName),
        semester_code: decodeURIComponent(semester),
        category: decodeURIComponent(category),
        subject_code: decodeURIComponent(subjectCode),
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        course_name: true,
        semester_code: true,
        subject_code: true,
        subject_name: true,
        premium: true,
        file_name: true,
        thumbnail_url: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            userDownloads: true,
            userLikes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get total counts
    const totalCounts = await prisma.post.aggregate({
      where: {
        course_name: decodeURIComponent(courseName),
        semester_code: decodeURIComponent(semester),
        category: decodeURIComponent(category),
        subject_code: decodeURIComponent(subjectCode),
      },
      _count: {
        _all: true
      },
      _sum: {
        downloads: true,
        likes: true,
        shares: true
      }
    });

    // Transform posts to include counts
    const transformedPosts = posts.map(post => ({
      ...post,
      downloads: post._count.userDownloads,
      likes: post._count.userLikes,
      shares: 0, // You can update this if you track shares
      _count: undefined // Remove the _count object from response
    }));

    return NextResponse.json({
      posts: transformedPosts,
      meta: {
        total: totalCounts._count._all,
        stats: {
          downloads: totalCounts._sum.downloads || 0,
          likes: totalCounts._sum.likes || 0,
          shares: totalCounts._sum.shares || 0
        },
        filters: {
          course: decodeURIComponent(courseName),
          semester: decodeURIComponent(semester),
          category: decodeURIComponent(category),
          subjectCode: decodeURIComponent(subjectCode)
        }
      }
    });

  } catch (error) {
    console.error("Error filtering posts:", error);
    return NextResponse.json({
      error: "Error filtering posts",
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
