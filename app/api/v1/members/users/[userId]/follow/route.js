import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

// Follow a user
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is logged in
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please login to follow users" }, { status: 401 });
    }

    const { userId } = params; // User to follow
    const followerId = session.user.id;

    // Validate user IDs
    if (!userId || !followerId) {
      return NextResponse.json({
        error: "Invalid user IDs",
        debug: { userId, followerId }
      }, { status: 400 });
    }

    // Don't allow self-following
    if (userId === followerId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json({ error: "Already following this user" }, { status: 400 });
    }

    // Create follow relationship
    await prisma.follows.create({
      data: {
        followerId,
        followingId: userId,
      },
    });

    // Get updated counts
    const followData = await prisma.follows.findMany({
      where: {
        OR: [
          { followingId: userId },
          { followerId: userId }
        ]
      }
    });

    const followers = followData.filter(f => f.followingId === userId).length;
    const following = followData.filter(f => f.followerId === userId).length;

    return NextResponse.json({ success: true, followers, following });
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json({
      error: "Failed to follow user",
      details: error.message
    }, { status: 500 });
  }
}

// Unfollow a user
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please login to unfollow users" }, { status: 401 });
    }

    const { userId } = params;
    const followerId = session.user.id;

    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId,
        },
      },
    });

    // Get updated counts
    const followData = await prisma.follows.findMany({
      where: {
        OR: [
          { followingId: userId },
          { followerId: userId }
        ]
      }
    });

    const followers = followData.filter(f => f.followingId === userId).length;
    const following = followData.filter(f => f.followerId === userId).length;

    return NextResponse.json({ success: true, followers, following });
  } catch (error) {
    console.error("Unfollow error:", error);
    return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 });
  }
}