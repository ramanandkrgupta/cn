// pages/api/v1/members/users/notifications/batch.js
import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notificationIds } = await req.json()

    // Batch update notifications
    const result = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id,
      },
      data: {
        read: true,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { error: 'Error updating notifications' },
      { status: 500 }
    )
  }
}
