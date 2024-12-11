"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  BookOpen,
  Brain,
  Clock,
  Trophy,
  History,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";

const DIFFICULTY_LEVELS = ["EASY", "MEDIUM", "HARD"];
const TOPICS = [
  "Web Development",
  "Data Structures",
  "Algorithms",
  "Database Management",
  "Machine Learning",
  "System Design",
];

export default function QuizPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Quiz generation states
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [questionCount, setQuestionCount] = useState(5);

  // Active quiz states
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Fetch quiz history on mount
  useEffect(() => {
    fetchQuizHistory();
  }, []);

  // Timer for active quiz
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchQuizHistory = async () => {
    try {
      const response = await fetch("/api/v1/members/quiz/generate");
      if (!response.ok) throw new Error("Failed to fetch quiz history");
      const data = await response.json();
      setQuizHistory(data.quizzes || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load quiz history");
    }
  };

  const handleGenerateQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/members/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          count: questionCount,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate quiz");

      const data = await response.json();
      setActiveQuiz(data.quiz);
      setTimeLeft(questionCount * 60); // 1 minute per question
      setUserAnswers(new Array(data.quiz.questions.length).fill(""));
      setCurrentQuestion(0);
      setQuizCompleted(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);

    // Auto-advance to next question
    if (currentQuestion < activeQuiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await fetch("/api/v1/members/quiz/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          answers: userAnswers,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit quiz");

      const data = await response.json();
      setQuizCompleted(true);
      await fetchQuizHistory(); // Refresh history
      toast.success("Quiz completed successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit quiz");
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">
          Please login to take quizzes
        </h2>
        <button
          onClick={() => router.push("/login")}
          className="btn btn-primary"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="w-8 h-8" />
          MCQ Quiz
        </h1>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="btn btn-ghost gap-2"
        >
          <History className="w-5 h-5" />
          History
        </button>
      </div>

      {showHistory ? (
        // Quiz History View
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setShowHistory(false)}
              className="btn btn-ghost btn-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h2 className="text-xl font-semibold">Your Quiz History</h2>
          </div>

          {quizHistory.length === 0 ? (
            <div className="text-center py-8 bg-base-200 rounded-lg">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-base-content/60" />
              <p>No quiz attempts yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {quizHistory.map((quiz) => (
                <div key={quiz.id} className="bg-base-200 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <p className="text-sm text-base-content/70">
                        Topic: {quiz.topic} • Difficulty: {quiz.difficulty}
                      </p>
                    </div>
                    {quiz.attempts?.[0] && (
                      <div className="text-right">
                        <div className="font-semibold">
                          Score: {quiz.attempts[0].score}/
                          {quiz.questions.length}
                        </div>
                        <p className="text-sm text-base-content/70">
                          {new Date(
                            quiz.attempts[0].completedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeQuiz ? (
        // Active Quiz View
        <div>
          {quizCompleted ? (
            // Quiz Results
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Quiz Completed!
              </h2>

              <div className="grid gap-4">
                {activeQuiz.questions.map((question, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      userAnswers[index] === question.correctAnswer
                        ? "bg-green-100 dark:bg-green-900/20"
                        : "bg-red-100 dark:bg-red-900/20"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {userAnswers[index] === question.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-1" />
                      )}
                      <div>
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm mt-1">
                          Your answer: {userAnswers[index]}
                        </p>
                        {userAnswers[index] !== question.correctAnswer && (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Correct answer: {question.correctAnswer}
                          </p>
                        )}
                        <p className="text-sm mt-2 text-base-content/70">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setActiveQuiz(null);
                  setQuizCompleted(false);
                }}
                className="btn btn-primary w-full"
              >
                Start New Quiz
              </button>
            </div>
          ) : (
            // Quiz Questions
            <div>
              {/* Progress and Timer */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm">
                  Question {currentQuestion + 1} of{" "}
                  {activeQuiz.questions.length}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </div>
              </div>

              {/* Question */}
              <div className="bg-base-200 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-4">
                  {activeQuiz.questions[currentQuestion].question}
                </h3>
                <div className="grid gap-3">
                  {activeQuiz.questions[currentQuestion].options.map(
                    (option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className={`p-3 rounded-lg text-left transition-colors ${
                          userAnswers[currentQuestion] === option
                            ? "bg-primary text-primary-content"
                            : "bg-base-300 hover:bg-base-300/80"
                        }`}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() =>
                    setCurrentQuestion((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentQuestion === 0}
                  className="btn btn-ghost"
                >
                  Previous
                </button>
                {currentQuestion === activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={userAnswers.some((answer) => !answer)}
                    className="btn btn-primary"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion((prev) => prev + 1)}
                    disabled={!userAnswers[currentQuestion]}
                    className="btn btn-ghost"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Quiz Setup View
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Topic Selection */}
            <div>
              <label className="label">Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="select select-bordered w-full"
                required
              >
                <option value="">Select a topic</option>
                {TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="label">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="select select-bordered w-full"
                required
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="label">Number of Questions</label>
            <input
              type="range"
              min="5"
              max="20"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="range"
              step="5"
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateQuiz}
            disabled={!topic || loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Start Quiz"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
