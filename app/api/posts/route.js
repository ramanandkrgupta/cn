import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        course_name: true,
        semester_code: true,
        subject_name: true,
        category: true,
        premium: true,
        file_name: true,
        downloads: true,
        likes: true,
        shares: true,
        createdAt: true,
      },
    });

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), { status: 500 });
  }
}