import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config.js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    // Get current user session
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    if (!query || query.length < 2) {
      return NextResponse.json({ posts: [], users: [] });
    }

    // Search posts
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { subject_name: { contains: query, mode: 'insensitive' } },
          { course_name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        title: true,
        category: true,
        subject_name: true,
        course_name: true,
        semester_code: true,
      }
    });

    // Search users
    let users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        university: true,
      },
      take: 5,
    });

    // Filter out current user from results if logged in
    if (currentUserId) {
      users = users.filter(user => user.id !== currentUserId);
    }

    return NextResponse.json({ posts, users });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}