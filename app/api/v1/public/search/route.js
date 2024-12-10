import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    
    // Only search if query is provided and at least 2 characters
    if (!query || query.length < 2) {
      return NextResponse.json({ posts: [] });
    }

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
      },
      take: 10, // Limit results
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
} 