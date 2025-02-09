import { NextResponse } from "next/server";
import { generatePDFThumbnail } from "@/libs/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

// MAX header = 100000

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url, key } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Convert the file URL to the public access link
    

    console.log('Generating thumbnail for:', { url, key });
    const thumbnailUrl = await generatePDFThumbnail(url, key);

    return NextResponse.json({ thumbnailUrl });
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    return NextResponse.json(
      { error: "Failed to generate thumbnail: " + error.message },
      { status: 500 }
    );
  }
}
