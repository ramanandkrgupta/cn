// File: /app/api/v1/members/posts/[id]/route.js (or .ts)
import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'

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
        description: body.description, // include description (optional)
        // Add any other fields you need to update
      },
    })

    // Return the updated post as JSON
    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: error.message || 'Error updating post' },
      { status: 500 }
    )
  }
}
