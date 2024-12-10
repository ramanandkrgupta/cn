import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current period stats
    const [
      totalUsers,
      totalDocuments,
      totalSubjects,
      totalDownloads,
      totalLikes,
      totalShares,
      premiumUsers,
      premiumContent
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.subject.count(),
      prisma.userDownload.count(),
      prisma.userLike.count(),
      prisma.post.aggregate({
        _sum: { shares: true }
      }),
      prisma.user.count({
        where: { userRole: "PRO" }
      }),
      prisma.post.count({
        where: { premium: true }
      })
    ]);

    // Get previous period stats (30 days ago)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      previousUsers,
      previousDocuments,
      previousDownloads
    ] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: { lt: thirtyDaysAgo }
        }
      }),
      prisma.post.count({
        where: {
          createdAt: { lt: thirtyDaysAgo }
        }
      }),
      prisma.userDownload.count({
        where: {
          createdAt: { lt: thirtyDaysAgo }
        }
      })
    ]);

    // Calculate trends
    const calculateTrend = (current, previous) => {
      if (previous === 0) return 100;
      return Math.round(((current - previous) / previous) * 100);
    };

    return NextResponse.json({
      users: {
        total: totalUsers,
        premium: premiumUsers,
        trend: calculateTrend(totalUsers, previousUsers)
      },
      documents: {
        total: totalDocuments,
        premium: premiumContent,
        trend: calculateTrend(totalDocuments, previousDocuments)
      },
      subjects: {
        total: totalSubjects,
        trend: 0
      },
      engagement: {
        downloads: totalDownloads,
        likes: totalLikes,
        shares: totalShares._sum.shares || 0,
        trend: calculateTrend(totalDownloads, previousDownloads)
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({
      error: "Error fetching dashboard stats",
      details: error.message
    }, { status: 500 });
  }
} 