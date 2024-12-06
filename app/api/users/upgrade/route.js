import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/send-code/route";

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

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
      // Update user with new role
      const updatedUser = await prisma.user.update({
        where: {
          id: session.user.id
        },
        data: {
          userRole: plan.toUpperCase()
        },
        select: {
          id: true,
          name: true,
          email: true,
          userRole: true,
          avatar: true
        }
      });

      // Format the response to match session structure
      const sessionUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.userRole, // Keep role for backward compatibility
        userRole: updatedUser.userRole,
        avatar: updatedUser.avatar
      };

      // Return formatted response
      return NextResponse.json({
        success: true,
        user: sessionUser,
        session: {
          user: sessionUser,
          expires: session.expires // Keep existing expiry
        }
      });

    } catch (updateError) {
      console.error("Error updating user:", updateError);
      return NextResponse.json({
        error: "Failed to update user role",
        details: updateError.message
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error in upgrade process:", error);
    return NextResponse.json({
      error: "Error upgrading user",
      details: error.message
    }, { status: 500 });
  }
} 