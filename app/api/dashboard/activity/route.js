import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    // Check for admin role
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get recent downloads with better error handling
    const [downloads, uploads, newUsers] = await Promise.all([
      prisma.userDownload.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true }
          },
          post: {
            select: { title: true }
          }
        }
      }).catch(() => []),

      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true }
          }
        }
      }).catch(() => []),

      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          createdAt: true
        }
      }).catch(() => [])
    ]);

    // Safely format activities
    const activities = [
      ...downloads.map(d => ({
        id: `dl_${d.id}`,
        type: 'download',
        message: `${d.user?.name || 'A user'} downloaded ${d.post?.title || 'a document'}`,
        timestamp: d.createdAt,
        link: `/dashboard/posts/${d.postId}`
      })),
      ...uploads.map(u => ({
        id: `up_${u.id}`,
        type: 'upload',
        message: `${u.user?.name || 'A user'} uploaded ${u.title || 'a document'}`,
        timestamp: u.createdAt,
        link: `/dashboard/posts/${u.id}`
      })),
      ...newUsers.map(u => ({
        id: `user_${u.id}`,
        type: 'user',
        message: `New user registered: ${u.name || 'Anonymous'}`,
        timestamp: u.createdAt,
        link: `/dashboard/users/${u.id}`
      }))
    ]
    .filter(activity => activity.timestamp) // Filter out invalid timestamps
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json({ 
      error: "Error fetching activity",
      details: error.message 
    }, { status: 500 });
  }
} 