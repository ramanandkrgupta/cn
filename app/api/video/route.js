// pages/api/videos.js



import prisma from "@/libs/prisma";

export async function GET() {
  try {
    const allVideo = await prisma.video.findMany();
    return new Response(JSON.stringify(allVideo), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    return new Response("An error occurred", {
      status: 500,
    });
  }
}