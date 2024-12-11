import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
    try {
        const [totalPosts, approvedPosts, pendingPosts] = await Promise.all([
            prisma.post.count(),
            prisma.post.count({ where: { status: "approved" } }),
            prisma.post.count({ where: { status: "pending" } })
        ]);

        const postsBySubject = await prisma.post.groupBy({
            by: ['subjectId'],
            _count: true,
            where: { status: "approved" },
            include: {
                subject: {
                    select: {
                        subject_name: true
                    }
                }
            }
        });

        return NextResponse.json({
            total: totalPosts,
            approved: approvedPosts,
            pending: pendingPosts,
            bySubject: postsBySubject
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch post statistics" },
            { status: 500 }
        );
    }
} 