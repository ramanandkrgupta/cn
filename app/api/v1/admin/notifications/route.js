import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

// Get all notifications
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Get notifications with pagination
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.notification.count()
    ]);

    // Get stats
    const stats = await prisma.notification.groupBy({
      by: ['type'],
      _count: {
        _all: true
      }
    });

    return NextResponse.json({
      notifications,
      stats,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({
      error: "Error fetching notifications",
      details: error.message
    }, { status: 500 });
  }
}

// Send new notification
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userIds, message, type = 'admin', image, link } = await req.json();

    if (!userIds?.length || !message) {
      return NextResponse.json({
        error: "Missing required fields"
      }, { status: 400 });
    }

    // Create notifications for all selected users
    const notifications = await Promise.all(
      userIds.map(userId =>
        prisma.notification.create({
          data: {
            userId,
            type,
            message,
            image,
            link
          }
        })
      )
    );

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json({
      error: "Error sending notifications",
      details: error.message
    }, { status: 500 });
  }
}

// Delete notification
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get('id');

    await prisma.notification.delete({
      where: { id: notificationId }
    });

    return NextResponse.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json({
      error: "Error deleting notification",
      details: error.message
    }, { status: 500 });
  }
} 