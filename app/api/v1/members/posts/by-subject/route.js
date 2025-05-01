import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Get the subject from query parameters
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    
    if (!subject) {
      return NextResponse.json(
        { error: 'Subject parameter is required' },
        { status: 400 }
      );
    }

    console.log('Fetching posts for subject:', subject);

    // Query the database
    const posts = await prisma.post.findMany({
      where: {
        subject_name: subject
      },
      select: {
        id: true,
        title: true,
        description: true,
        subject_name: true,
        course_name: true,
        semester_code: true,
        category: true,
      },
      take: 10,
    });

    console.log(`Found ${posts.length} posts for subject: ${subject}`);
    
    // Return the posts directly as an array
    return NextResponse.json(posts);
    
  } catch (error) {
    console.error('Error fetching posts by subject:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
