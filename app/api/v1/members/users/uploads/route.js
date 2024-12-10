import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const uploads = await prisma.post.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        userLikes: true,
        userDownloads: true
      }
    });

    return NextResponse.json(uploads);
  } catch (error) {
    console.error("Error fetching uploads:", error);
    return NextResponse.json({ error: "Error fetching uploads" }, { status: 500 });
  }
} 