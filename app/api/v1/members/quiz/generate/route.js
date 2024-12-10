import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import prisma from "@/libs/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { topic, difficulty, count = 5, type = "MCQ" } = await req.json();

    const prompt = `
      Generate a quiz about ${topic} with exactly ${count} multiple choice questions.
      Difficulty level: ${difficulty}
      
      For each question:
      1. Write a clear, concise question
      2. Provide exactly 4 options (A, B, C, D)
      3. Mark the correct answer
      4. Add a brief explanation why it's correct
      
      Return ONLY valid JSON in this exact format, with no additional text or formatting:
      {
        "title": "Quiz about ${topic}",
        "topic": "${topic}",
        "difficulty": "${difficulty}",
        "questions": [
          {
            "question": "The question text",
            "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
            "correctAnswer": "The full correct option text",
            "explanation": "Why this answer is correct",
            "type": "MCQ",
            "points": 1
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Clean and parse the response
    let quizData;
    try {
      // Remove any markdown formatting or extra text
      const jsonStr = response.replace(/```json\n|\n```/g, '').trim();
      quizData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.log("Raw response:", response);
      throw new Error("Failed to generate valid quiz format");
    }

    // Validate quiz structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error("Invalid quiz format: missing questions array");
    }

    // Validate each question
    quizData.questions = quizData.questions.map(q => ({
      question: q.question || "Question not provided",
      options: Array.isArray(q.options) ? q.options.slice(0, 4) : ["A", "B", "C", "D"],
      correctAnswer: q.correctAnswer || q.options[0],
      explanation: q.explanation || "Explanation not provided",
      type: "MCQ",
      points: 1
    }));

    // Save quiz to database
    const quiz = await prisma.quiz.create({
      data: {
        title: quizData.title || `Quiz about ${topic}`,
        topic: quizData.topic || topic,
        difficulty: quizData.difficulty || difficulty,
        userId: session.user.id,
        questions: {
          create: quizData.questions
        }
      },
      include: {
        questions: true
      }
    });

    return new Response(JSON.stringify({ quiz }), { status: 200 });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate quiz",
        details: error.message,
        // Add stack trace in development
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { status: 500 }
    );
  }
}

// Get user's quiz history
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const quizzes = await prisma.quiz.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        questions: true,
        attempts: {
          where: {
            userId: session.user.id
          },
          orderBy: {
            startedAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify({ quizzes }), { status: 200 });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch quizzes", details: error.message }),
      { status: 500 }
    );
  }
}


