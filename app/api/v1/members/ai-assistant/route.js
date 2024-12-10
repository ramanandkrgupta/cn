import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== 'PRO') {
      return NextResponse.json(
        { error: "AI Assistant is a PRO feature" },
        { status: 403 }
      );
    }

    const { message } = await req.json();

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate context-aware prompt
    const prompt = `As a helpful study assistant, please help with this question: ${message}

    Please provide:
    1. A clear, concise answer
    2. Relevant examples if applicable
    3. Additional resources or related topics
    4. Practice questions if relevant`;

    // Get response from AI
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return NextResponse.json({ response });

  } catch (error) {
    console.error("AI Assistant error:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    );
  }
}