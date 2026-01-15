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
    console.log("PROFILE_ROUTE_DEBUG_SESSION:", JSON.stringify(session, null, 2));
    if (!session?.user) {
      console.log("PROFILE_ROUTE_ERROR: User not found in session");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    // Update allowed fields including new educational fields
    const allowedUpdates = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      university: data.university,
      college: data.college,
      avatar: data.avatar,
      level: data.level, // New field
      stream: data.stream, // New field
      degree: data.degree, // New field
      specialization: data.specialization, // New field
      year: data.year, // New field
      semester: data.semester, // New field
      location: data.location, // New field
      links: data.links, // New field
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
        level: true,
        stream: true,
        degree: true,
        specialization: true,
        year: true,
        semester: true,
        location: true,
        links: true,
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
    console.log("PROFILE_GET_DEBUG_SESSION:", JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
      console.log("PROFILE_GET_ERROR: Session or User ID missing", {
        hasSession: !!session,
        hasUser: !!session?.user,
        hasId: !!session?.user?.id
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        university: true,
        college: true,
        level: true,
        stream: true,
        degree: true,
        specialization: true,
        year: true,
        semester: true,
        location: true,
        uploadCount: true,
        verifiedUploads: true,
        reputationScore: true,
        links: true,
        // downloads: true
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get follower and following counts
    const followData = await prisma.follows.findMany({
      where: {
        OR: [{ followingId: userId }, { followerId: userId }],
      },
    })

    // Calculate followers and following
    const followers = followData.filter((f) => f.followingId === userId).length
    const following = followData.filter((f) => f.followerId === userId).length

    // Calculate downloads count for user in count query
    const downloadsCount = await prisma.UserDownload.count({
      where: {
        userId,
      },
    })

    const uploadsCount = await prisma.Quiz.count({
      where: {
        userId,
      },
    })

    return NextResponse.json({
      ...user,
      followers,
      following,
      downloadsCount,
      uploadsCount,
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}
