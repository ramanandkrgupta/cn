import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const { postId } = await req.json();

    // Check if user is authenticated for premium content
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

    if (post.premium && (!session || session.user.userRole !== "PRO")) {
      return NextResponse.json(
        { error: "Unauthorized access to premium content" },
        { status: 403 }
      );
    }

    // Return a temporary signed URL or process file download
    return NextResponse.json({ fileUrl: post.file_url });
  } catch (error) {
    console.error("Error accessing secure file:", error);
    return NextResponse.json(
      { error: "Error accessing file" },
      { status: 500 }
    );
  }
} 