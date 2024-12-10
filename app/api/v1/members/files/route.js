import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const subject = searchParams.get('subject');

    // Build where clause
    const where = {
      status: "approved", // Only show approved files
      AND: [
        type && type !== 'all' ? { file_name: { endsWith: `.${type}` } } : {},
        subject && subject !== 'all' ? { subject_code: subject } : {},
      ]
    };

    // Fetch files with related data
    const files = await prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        file_name: true,
        file_url: true,
        subject_name: true,
        subject_code: true,
        downloads: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Process files to add additional info
    const processedFiles = files.map(file => {
      const sizeInMB = Math.random() * 10 + 0.1; // Replace with actual file size
      return {
        ...file,
        type: file.file_name?.split('.').pop()?.toLowerCase() || 'unknown',
        size: `${sizeInMB.toFixed(1)} MB`,
        isDownloadable: true,
      };
    });

    return NextResponse.json(processedFiles);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
} 