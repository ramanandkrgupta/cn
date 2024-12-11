import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
    try {
        // Get latest training stats
        const [lastTraining, totalTrainings] = await Promise.all([
            prisma.aITraining.findFirst({
                orderBy: { timestamp: 'desc' }
            }),
            prisma.aITraining.count()
        ]);

        // Get training history
        const recentTrainings = await prisma.aITraining.findMany({
            orderBy: { timestamp: 'desc' },
            take: 5,
            select: {
                timestamp: true,
                status: true,
                dataSnapshot: true
            }
        });

        return NextResponse.json({
            lastTraining: {
                timestamp: lastTraining?.timestamp,
                status: lastTraining?.status,
                stats: lastTraining ? JSON.parse(lastTraining.dataSnapshot) : null
            },
            totalTrainings,
            recentTrainings: recentTrainings.map(t => ({
                timestamp: t.timestamp,
                status: t.status,
                stats: JSON.parse(t.dataSnapshot)
            }))
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch training status" },
            { status: 500 }
        );
    }
} 