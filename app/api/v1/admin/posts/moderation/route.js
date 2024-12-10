import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/send-code/route";
import { createNotification } from "@/libs/notifications";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';

    const posts = await prisma.post.findMany({
      where: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, action, note } = await req.json();

    if (!postId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { user: true }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Update post status
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        status: action === 'approve' ? 'approved' : 'rejected',
        moderatedBy: session.user.id,
        moderatedAt: new Date(),
        moderationNote: note
      }
    });

    // Update moderation record
    await prisma.contentModeration.create({
      data: {
        postId,
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewedBy: session.user.id,
        note
      }
    });

    // Create notification for post owner
    const notificationMessage = action === 'approve'
      ? `Your post "${post.title}" has been approved`
      : `Your post "${post.title}" was rejected${note ? `: ${note}` : ''}`;

    await createNotification(
      post.userId,
      action === 'approve' ? 'success' : 'warning',
      notificationMessage
    );

    // Update user stats if approved
    if (action === 'approve') {
      await prisma.user.update({
        where: { id: post.userId },
        data: {
          verifiedUploads: { increment: 1 },
          reputationScore: { increment: 10 }
        }
      });
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error("Error moderating post:", error);
    return NextResponse.json({ error: "Error moderating post" }, { status: 500 });
  }
}