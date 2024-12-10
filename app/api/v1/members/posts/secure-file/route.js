import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const { postId } = await req.json();

    // Check if user is logged in for any download
    if (!session?.user) {
      return NextResponse.json(
        { error: "Please login to download files" },
        { status: 401 }
      );
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        file_url: true,
        premium: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Additional check for premium content
    if (post.premium && session.user.userRole !== "PRO") {
      return NextResponse.json(
        { error: "Premium content requires PRO membership" },
        { status: 403 }
      );
    }

    return NextResponse.json({ fileUrl: post.file_url });
  } catch (error) {
    console.error("Error accessing secure file:", error);
    return NextResponse.json(
      { error: "Error accessing file" },
      { status: 500 }
    );
  }
} 