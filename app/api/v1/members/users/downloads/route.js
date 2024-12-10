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

    const downloads = await prisma.userDownload.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        post: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(downloads);
  } catch (error) {
    console.error("Error fetching downloads:", error);
    return NextResponse.json({ error: "Error fetching downloads" }, { status: 500 });
  }
} 