import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(req) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if training is needed
    const lastTraining = await prisma.aITraining.findFirst({
      orderBy: { timestamp: 'desc' }
    });

    const needsTraining = !lastTraining || 
      (Date.now() - lastTraining.timestamp.getTime() > 24 * 60 * 60 * 1000); // 24 hours

    if (needsTraining) {
      // Trigger training
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/admin/ai/train`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ADMIN_API_KEY}`
        }
      });

      const result = await response.json();
      return NextResponse.json(result);
    }

    return NextResponse.json({ message: "Training not needed" });

  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Cron job failed", details: error.message },
      { status: 500 }
    );
  }
} 