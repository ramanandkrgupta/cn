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

    // Get current counts
    const [users, documents, subjects, downloads] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.subject.count(),
      prisma.userDownload.count(),
    ]);

    // Get counts from 30 days ago for trend calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get previous counts without using createdAt for subject
    const [previousUsers, previousDocuments, previousDownloads] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            lt: thirtyDaysAgo
          }
        }
      }),
      prisma.post.count({
        where: {
          createdAt: {
            lt: thirtyDaysAgo
          }
        }
      }),
      prisma.userDownload.count({
        where: {
          createdAt: {
            lt: thirtyDaysAgo
          }
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
        total: users,
        trend: calculateTrend(users, previousUsers)
      },
      documents: {
        total: documents,
        trend: calculateTrend(documents, previousDocuments)
      },
      subjects: {
        total: subjects,
        trend: 0 // Since we can't track trend for subjects
      },
      downloads: {
        total: downloads,
        trend: calculateTrend(downloads, previousDownloads)
      }
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ 
      error: "Error fetching stats",
      details: error.message 
    }, { status: 500 });
  }
} 