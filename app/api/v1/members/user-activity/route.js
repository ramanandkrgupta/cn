import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import prisma from "@/libs/prisma";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's recent activity
    const [posts, downloads, conversations] = await Promise.all([
      prisma.post.findMany({
        where: { userId: session.user.id },
        select: { subject_name: true, category: true },
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.userDownload.findMany({
        where: { userId: session.user.id },
        include: { post: true },
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.aIConversation.findMany({
        where: { userId: session.user.id },
        orderBy: { timestamp: 'desc' },
        take: 5
      })
    ]);

    // Analyze interests
    const interests = new Set();
    [...posts, ...downloads.map(d => d.post)].forEach(item => {
      if (item?.subject_name) interests.add(item.subject_name);
    });

    // Get recent topics
    const recentTopics = conversations.map(c => c.query);

    return NextResponse.json({
      interests: Array.from(interests),
      recentTopics,
      stats: {
        posts: posts.length,
        downloads: downloads.length,
        conversations: conversations.length
      }
    });

  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch user activity" },
      { status: 500 }
    );
  }
} 