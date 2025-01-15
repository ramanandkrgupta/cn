import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'

// Keep existing helper function
const getRandomColor = () => {
  const colors = [
    '0088CC', // Blue
    '00A36C', // Green
    'CD5C5C', // Red
    'FFB347', // Orange
    '9370DB', // Purple
    '40E0D0', // Turquoise
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    // Update allowed fields including new university, college, and avatar
    const allowedUpdates = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      university: data.university,
      college: data.college,
      avatar: data.avatar, // Include avatar in allowed updates
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: allowedUpdates,
      select: {
        id: true,
        name: true,
        email: true,
        userRole: true,
        avatar: true,
        phoneNumber: true,
        university: true,
        college: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        userRole: true,
        avatar: true,
        phoneNumber: true,
        university: true,
        college: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
