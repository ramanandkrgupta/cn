"use client";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Send,
  Bot,
  Loader,
  Book,
  Calendar,
  Target,
  Brain,
  Sparkles,
  RefreshCw,
  Download,
  Copy,
  Share2,
  Eraser,
  Volume2,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AIAssistant() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [activeType, setActiveType] = useState("chat");
  const chatEndRef = useRef(null);

  // Add user activity state
  const [userActivity, setUserActivity] = useState(null);

  // Load user activity on mount
  useEffect(() => {
    if (session?.user) {
      fetchUserActivity();
    }
  }, [session]);

  const fetchUserActivity = async () => {
    try {
      const response = await fetch("/api/v1/members/user-activity");
      if (response.ok) {
        const data = await response.json();
        setUserActivity(data);
      }
    } catch (error) {
      console.error("Error fetching user activity:", error);
    }
  };

  // Welcome message effect
  // useEffect(() => {
  //   if (session?.user && conversation.length === 0) {
  //     setConversation([{
  //       role: "assistant",
  //       content: `Hi ${session.user.name}! I'm your AI study buddy. I see you're interested in ${userActivity?.interests.join(', ') || 'various subjects'}. How can I help you today?`,
  //       type: "greeting"
  //     }]);
  //   }
  // }, [session, userActivity]);

  const quickActions = [
    {
      icon: <Brain className="w-5 h-5" />,
      label: "General Chat",
      type: "chat",
      color: "text-primary",
      description: "Ask any study-related question",
    },
    {
      icon: <Book className="w-5 h-5" />,
      label: "Generate Quiz",
      type: "quiz",
      color: "text-success",
      description: "Create practice questions",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Study Plan",
      type: "study_plan",
      color: "text-info",
      description: "Get personalized study schedule",
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: "Deep Explain",
      type: "explain",
      color: "text-warning",
      description: "Detailed topic explanation",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const userMessage = { role: "user", content: query };
    setConversation((prev) => [...prev, userMessage]);
    setQuery("");

    try {
      const response = await fetch("/api/v1/members/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          type: activeType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get response");
      }

      const data = await response.json();
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          type: data.type,
        },
      ]);
    } catch (error) {
      toast.error(error.message || "Failed to get AI response");
      setConversation((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Add suggested questions based on type
  const suggestions = {
    chat: [
      "How can I improve my study habits?",
      "What's the best way to prepare for exams?",
      "Can you explain the concept of...",
    ],
    quiz: [
      "Create a quiz about Newton's Laws",
      "Test my knowledge of World War II",
      "Make a practice test for Chemistry",
    ],
    study_plan: [
      "Create a study plan for final exams",
      "Help me plan my next week's study schedule",
      "Make a revision timetable for Mathematics",
    ],
    explain: [
      "Explain quantum physics in simple terms",
      "Help me understand photosynthesis",
      "Break down the concept of derivatives",
    ],
  };

  // Text-to-speech function
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  // Message actions
  const handleMessageAction = (action, content) => {
    switch (action) {
      case "copy":
        navigator.clipboard.writeText(content);
        toast.success("Copied to clipboard");
        break;
      case "speak":
        speakText(content);
        break;
      case "share":
        // Implement share functionality
        break;
      case "download":
        // Implement download as PDF/MD
        break;
    }
  };

  if (!session) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header with typing indicator */}
      <div className="flex items-center justify-between mb-6 bg-base-200 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot size={32} className="text-primary" />
            {loading && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Study Assistant</h1>
            <p className="text-gray-500 text-sm">
              {loading ? "Thinking..." : "Ready to help!"}
            </p>
          </div>
        </div>
        {session?.user && (
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-medium">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.role}</p>
            </div>
            <div className="avatar">
              <div className="w-10 h-10 rounded-full">
                <Image
                  src={session.user.avatar || "/images/default-avatar.png"}
                  alt={session.user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {quickActions.map((action) => (
          <button
            key={action.type}
            onClick={() => setActiveType(action.type)}
            className={`p-4 rounded-lg transition-all ${
              activeType === action.type 
                ? 'bg-base-300 ring-2 ring-primary shadow-lg transform scale-105'
                : 'bg-base-200 hover:bg-base-300 hover:scale-102'
            }`}
          >
            <div className={`${action.color} mb-2`}>{action.icon}</div>
            <div className="font-medium">{action.label}</div>
            <div className="text-xs text-gray-500 mt-1">{action.description}</div>
          </button>
        ))}
      </div> */}

      {/* Suggestions */}
      {showSuggestions && conversation.length === 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Suggested Questions
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestions[activeType].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(suggestion);
                  setShowSuggestions(false);
                }}
                className="btn btn-sm btn-ghost bg-base-200 hover:bg-base-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="bg-base-200 rounded-lg p-4 mb-4 min-h-[60vh] max-h-[60vh] overflow-y-auto">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar for assistant */}
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot size={20} className="text-primary" />
                </div>
              </div>
            )}

            <div
              className={`group relative inline-block max-w-[80%] p-3 rounded-lg ${
                msg.role === "user" ? "bg-primary text-white" : "bg-base-300"
              }`}
            >
              {/* Message Type Badge */}
              {msg.role === "assistant" && msg.type && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <Sparkles size={12} />
                  {msg.type.replace("_", " ").toUpperCase()}
                </div>
              )}

              {/* Message Content */}
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {msg.content}
              </div>

              {/* Message Actions */}
              {msg.role === "assistant" && (
                <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col gap-1 bg-base-100 rounded-lg shadow-lg p-1">
                    <button
                      onClick={() => handleMessageAction("copy", msg.content)}
                      className="btn btn-ghost btn-xs"
                      title="Copy"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => handleMessageAction("speak", msg.content)}
                      className={`btn btn-ghost btn-xs ${
                        isSpeaking ? "text-primary" : ""
                      }`}
                      title="Read aloud"
                    >
                      <Volume2 size={14} />
                    </button>
                    <button
                      onClick={() =>
                        handleMessageAction("download", msg.content)
                      }
                      className="btn btn-ghost btn-xs"
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => handleMessageAction("share", msg.content)}
                      className="btn btn-ghost btn-xs"
                      title="Share"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Typing Indicator */}
              {msg.role === "assistant" &&
                loading &&
                index === conversation.length - 1 && (
                  <div className="mt-2 flex gap-1">
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                )}
            </div>

            {/* Avatar for user */}
            {msg.role === "user" && session?.user && (
              <div className="flex-shrink-0 ml-3">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={session.user.avatar || "/images/default-avatar.png"}
                    alt={session.user.name}
                    width={32}
                    height={32}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Controls */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="btn btn-sm btn-ghost"
          title="Toggle suggestions"
        >
          <Sparkles size={16} />
        </button>
        <button
          onClick={() => {
            if (confirm("Clear chat history?")) {
              setConversation([]);
              setShowSuggestions(true);
            }
          }}
          className="btn btn-sm btn-ghost"
          title="Clear chat"
        >
          <Eraser size={16} />
        </button>
        <button
          onClick={() => {
            setConversation([]);
            setShowSuggestions(true);
            fetchUserActivity();
          }}
          className="btn btn-sm btn-ghost"
          title="New chat"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`${
            loading
              ? "AI is typing..."
              : `Ask about ${activeType.replace("_", " ")}...`
          }`}
          className="input input-bordered flex-1"
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? <Loader className="animate-spin" /> : <Send />}
        </button>
      </form>
    </div>
  );
}
