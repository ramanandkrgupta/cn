import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

export async function GET(req, { params }) {
  try {
    const { userId } = params;
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

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
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get follower and following counts
    const followData = await prisma.follows.findMany({
      where: {
        OR: [
          { followingId: userId },
          { followerId: userId }
        ]
      }
    });

    // Calculate followers and following
    const followers = followData.filter(f => f.followingId === userId).length;
    const following = followData.filter(f => f.followerId === userId).length;

    // Check if current user is following this user
    let isFollowing = false;
    if (currentUserId) {
      const followRelation = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: userId
          }
        }
      });
      isFollowing = !!followRelation;
    }

    return NextResponse.json({
      ...user,
      followers,
      following,
      isFollowing
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}