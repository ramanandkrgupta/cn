import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const sortBy = searchParams.get('sortBy') || 'newest';
    let page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Build where clause
    const where = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { subject_name: { contains: search, mode: 'insensitive' } },
            { course_name: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        category && category !== 'all' ? { category } : {}
      ].filter(Boolean) // Remove empty conditions
    };

    // Get total count first
    const total = await prisma.post.count({ where });

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Adjust page number if it exceeds total pages
    page = Math.min(page, totalPages || 1);

    // Calculate skip
    const skip = (page - 1) * limit;

    // Determine sort order
    let orderBy;
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'most-downloads':
        orderBy = { downloads: 'desc' };
        break;
      case 'most-likes':
        orderBy = { likes: 'desc' };
        break;
      case 'most-shares':
        orderBy = { shares: 'desc' };
        break;
      default: // 'newest'
        orderBy = { createdAt: 'desc' };
    }

    // Get posts with pagination
    const posts = await prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        course_name: true,
        subject_name: true,
        semester_code: true,
        premium: true,
        downloads: true,
        likes: true,
        shares: true,
        createdAt: true,
        user: {
          select: {
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
      orderBy,
      skip,
      take: limit
    });

    // Get stats for all posts (not affected by filtering)
    const stats = await prisma.post.aggregate({
      _sum: {
        downloads: true,
        likes: true,
        shares: true
      }
    });

    // Get category distribution
    const categoryStats = await prisma.post.groupBy({
      by: ['category'],
      _count: {
        _all: true
      },
      where: {
        category: { not: null }
      }
    });

    return NextResponse.json({
      posts,
      stats: {
        totalDownloads: stats._sum.downloads || 0,
        totalLikes: stats._sum.likes || 0,
        totalShares: stats._sum.shares || 0,
        categoryDistribution: categoryStats
      },
      pagination: {
        total,
        pages: totalPages,
        page,
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({
      error: "Error fetching posts",
      details: error.message
    }, { status: 500 });
  }
}

// Delete post
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    await prisma.post.delete({
      where: { id: postId }
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({
      error: "Error deleting post",
      details: error.message
    }, { status: 500 });
  }
}

// Toggle premium status
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        premium: {
          set: false // Toggle the current value
        }
      },
      select: {
        id: true,
        premium: true
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({
      error: "Error updating post",
      details: error.message
    }, { status: 500 });
  }
} 