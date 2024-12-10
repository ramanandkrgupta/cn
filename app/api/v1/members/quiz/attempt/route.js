import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import prisma from "@/libs/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { quizId, answers } = await req.json();

    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true }
    });

    if (!quiz) {
      return new Response(JSON.stringify({ error: "Quiz not found" }), { status: 404 });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score += question.points;
      }
    });

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId: session.user.id,
        score,
        answers,
        completedAt: new Date()
      }
    });

    return new Response(JSON.stringify({ attempt }), { status: 200 });
  } catch (error) {
    console.error("Error submitting quiz attempt:", error);
    return new Response(
      JSON.stringify({ error: "Failed to submit quiz", details: error.message }),
      { status: 500 }
    );
  }
} 