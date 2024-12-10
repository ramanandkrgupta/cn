import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import { createNotification } from "@/libs/notifications";

export async function POST(req) {
  try {
    const { postId, metricType } = await req.json();

    // First get the current post with owner info
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
        title: true,  // Add title for better notification messages
        downloads: true,
        likes: true,
        shares: true
      }
    });

    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // For shares, no login required but track who shared if logged in
    if (metricType === 'shares') {
      const session = await getServerSession(authOptions);
      const sharerName = session?.user?.name || "Someone";

      const newShareCount = currentPost.shares + 1;
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { shares: newShareCount },
        select: {
          id: true,
          downloads: true,
          likes: true,
          shares: true
        }
      });

      // Only notify if the sharer is not the post owner
      if (currentPost.userId && (!session?.user?.id || session.user.id !== currentPost.userId)) {
        await createNotification(
          currentPost.userId,
          'share',
          `${sharerName} shared your post "${currentPost.title}"`
        );
      }

      return NextResponse.json(updatedPost);
    }

    // For likes and downloads, require login
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userName = session.user.name || "Someone";

    // Handle likes
    if (metricType === 'likes') {
      const existingLike = await prisma.userLike.findFirst({
        where: {
          userId: userId,
          postId: postId
        }
      });

      if (existingLike) {
        return NextResponse.json({ error: "Already liked" }, { status: 400 });
      }

      await prisma.userLike.create({
        data: {
          userId: userId,
          postId: postId
        }
      });

      const newLikeCount = currentPost.likes + 1;
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { likes: newLikeCount },
        select: {
          id: true,
          downloads: true,
          likes: true,
          shares: true
        }
      });

      // Only notify if the liker is not the post owner
      if (userId !== currentPost.userId) {
        await createNotification(
          currentPost.userId,
          'like',
          `${userName} liked your post "${currentPost.title}"`
        );
      }

      return NextResponse.json(updatedPost);
    }

    // Handle downloads
    if (metricType === 'downloads') {
      await prisma.userDownload.create({
        data: {
          userId: userId,
          postId: postId
        }
      });

      const newDownloadCount = currentPost.downloads + 1;
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { downloads: newDownloadCount },
        select: {
          id: true,
          downloads: true,
          likes: true,
          shares: true
        }
      });

      // Only notify if the downloader is not the post owner
      if (userId !== currentPost.userId) {
        await createNotification(
          currentPost.userId,
          'download',
          `${userName} downloaded your post "${currentPost.title}"`
        );
      }

      return NextResponse.json(updatedPost);
    }

    return NextResponse.json({ error: "Invalid metric type" }, { status: 400 });
  } catch (error) {
    console.error("Error updating metrics:", error);
    return NextResponse.json({
      error: "Error updating metrics",
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

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const userId = session.user.id;

    if (!userId || !postId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const [like, download] = await Promise.all([
      prisma.userLike.findFirst({
        where: {
          AND: [
            { userId: userId },
            { postId: postId }
          ]
        }
      }),
      prisma.userDownload.findFirst({
        where: {
          AND: [
            { userId: userId },
            { postId: postId }
          ]
        }
      })
    ]);

    return NextResponse.json({
      hasLiked: !!like,
      hasDownloaded: !!download
    });
  } catch (error) {
    console.error("Error checking interaction:", error);
    return NextResponse.json({ error: "Error checking interaction" }, { status: 500 });
  }
} 