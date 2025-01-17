import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

export async function GET(req, { params }) {
  try {
    const { userId } = params;

    // Get all users being followed
    const follows = await prisma.follows.findMany({
      where: {
        followerId: userId
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            university: true,
          }
        }
      }
    });

    // Extract following information
    const following = follows.map(follow => follow.following);

    return NextResponse.json({ following });
  } catch (error) {
    console.error('Error fetching following:', error);
    return NextResponse.json({ error: 'Failed to fetch following users' }, { status: 500 });
  }
}