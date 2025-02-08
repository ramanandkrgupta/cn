import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";


export async function GET(req) {
  try {
    const url = new URL(req.url)
    // Use a default limit if none provided.
    const limit = parseInt(url.searchParams.get('limit')) || 20
    // Optional parameters for pagination and filtering
    const before = url.searchParams.get('before') // ISO string date
    const recent = url.searchParams.get('recent') === 'true'

    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Build the where clause
    let whereClause = { userId: session.user.id }

    if (recent && !before) {
      // For the initial load, show only notifications from the last 2 days.
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
      whereClause.createdAt = { gte: twoDaysAgo }
    }
    if (before) {
      // Load notifications older than the given timestamp.
      whereClause.createdAt = { lt: new Date(before) }
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Error fetching notifications' },
      { status: 500 }
    )
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationId } = await req.json();

    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id
      },
      data: {
        read: true
      }
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ error: "Error updating notification" }, { status: 500 });
  }
}