import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'

export async function DELETE(req, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Directly extract id from context.params (no need for await)
    const { id } = context.params

    // Find the post by id
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Only allow deletion if the user is the post owner or an admin
    if (session.user.id !== post.userId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
    }

    // Delete related UserLike and UserDownload records
    await prisma.userLike.deleteMany({ where: { postId: id } })
    await prisma.userDownload.deleteMany({ where: { postId: id } })

    // Delete the post
    await prisma.post.delete({ where: { id } })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: error.message || 'Error deleting post' },
      { status: 500 }
    )
  }
}
