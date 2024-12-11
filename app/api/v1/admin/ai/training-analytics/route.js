import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(req) {
  try {
    const [trainings, conversations] = await Promise.all([
      prisma.aITraining.findMany({
        orderBy: { timestamp: 'desc' },
        take: 30 // Last 30 days
      }),
      prisma.aIConversation.findMany({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Analyze training effectiveness
    const analytics = {
      trainingFrequency: trainings.length,
      averageResponseLength: conversations.reduce((acc, conv) => 
        acc + conv.response.length, 0) / conversations.length,
      topicCoverage: conversations.reduce((acc, conv) => {
        if (!acc[conv.type]) acc[conv.type] = 0;
        acc[conv.type]++;
        return acc;
      }, {}),
      userSatisfaction: "Coming soon" // Add feedback mechanism
    };

    return NextResponse.json(analytics);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
} 