import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const hash = searchParams.get('hash');

    const existingPost = await prisma.post.findFirst({
      where: { 
        fileHash: hash,
        isLatestVersion: true 
      }
    });

    return NextResponse.json({ 
      isDuplicate: !!existingPost,
      existingPost: existingPost ? {
        id: existingPost.id,
        title: existingPost.title
      } : null
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 