// File: /app/api/v1/members/posts/[id]/route.js (or .ts)
import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        title: true,
        description: true,
        subject_name: true,
        course_name: true,
        semester_code: true,
        category: true,
        file_size: true,
        file_url: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = context.params

    // Parse the request body as JSON.
    const body = await req.json()

    // Basic validation (adjust as needed)
    if (!body.title || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: title and category are required.' },
        { status: 400 }
      )
    }

    // Update the post in the database
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        category: body.category,
        description: body.description,

        // include description (optional)
        // Add any other fields you need to update
        premium: body.premium, //boolean
      },
    })

    // Return the updated post as JSON
    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error.message)
    return NextResponse.json(
      { error: error.message || 'Error updating post' },
      { status: 500 }
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // First, delete all related likes for the post
    await prisma.userLike.deleteMany({
      where: { postId: id },
    })

    // Then, delete all related downloads for the post
    await prisma.userDownload.deleteMany({
      where: { postId: id },
    })

    // Finally, delete the post itself
    const deletedPost = await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Post deleted successfully', deletedPost },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting post:', error)

    return NextResponse.json(
      { error: error.message || 'Error deleting post' },
      { status: 500 }
    )
  }
}
