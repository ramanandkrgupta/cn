import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

// Add helper function at the top
const getRandomColor = () => {
  const colors = [
    '0088CC', // Blue
    '00A36C', // Green
    'CD5C5C', // Red
    'FFB347', // Orange
    '9370DB', // Purple
    '40E0D0', // Turquoise
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, avatar } = await req.json();
    const userId = session.user.id;

    // Validate avatar selection for non-PRO users
    if (!avatar.startsWith('/avatars/') && session.user.role !== 'PRO') {
      return NextResponse.json({
        error: "Premium avatars are only available for PRO users"
      }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        avatar
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        userRole: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({
      error: "Error updating profile",
      details: error.message
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      },
    });

    // Generate avatar URL if none exists
    if (!user.avatar) {
      const seed = encodeURIComponent(user.name || user.email.split('@')[0]);
      user.avatar = `https://api.dicebear.com/6.x/initials/png?seed=${seed}&backgroundColor=${getRandomColor()}`;
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Error fetching profile" }, { status: 500 });
  }
}