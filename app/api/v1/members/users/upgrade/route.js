import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    if (!plan) {
      return NextResponse.json({ error: "Plan is required" }, { status: 400 });
    }

    // Update user with new role
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        userRole: plan.toUpperCase()
      },
      select: {
        id: true,
        name: true,
        email: true,
        userRole: true,
        avatar: true,
        // Add any other fields you need
      }
    });

    // Format response with role mapping
    const formattedUser = {
      ...updatedUser,
      role: updatedUser.userRole // Add role field for consistency
    };

    return NextResponse.json({
      success: true,
      user: formattedUser
    });

  } catch (error) {
    console.error("Error in upgrade process:", error);
    return NextResponse.json({
      error: "Error upgrading user",
      details: error.message
    }, { status: 500 });
  }
} 