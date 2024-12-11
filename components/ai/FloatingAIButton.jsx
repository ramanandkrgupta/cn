"use client";
import { useState, useEffect } from "react";
import {
  Bot,
  X,
  Minimize2,
  Maximize2,
  Brain,
  Book,
  Lightbulb,
  History,
  Trash2,
  Plus,
  RefreshCw,
  Calendar,
  Target,
  Sparkles,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import toast  from "react-hot-toast";

export default function FloatingAIButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [recentQueries, setRecentQueries] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);

  // Hide on certain pages
  const shouldHide = [
    "/account/ai-assistant",
    "/login",
    "/register",
    "/admin",
  ].includes(pathname);

  // Load recent queries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("aiRecentQueries");
    if (saved) {
      setRecentQueries(JSON.parse(saved));
    }
    loadCurrentChat();
  }, []);

  const loadCurrentChat = async () => {
    try {
      const response = await fetch("/api/v1/members/ai-assistant");
      if (!response.ok) throw new Error("Failed to fetch chat");
      const data = await response.json();
      if (data.length > 0) {
        setCurrentChat(data[0]);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  const handleClick = () => {
    if (!session) {
      toast.error("Please login to use AI Assistant");
      return;
    }

    if (session.user.role !== "PRO") {
      toast.error("AI Assistant is a PRO feature");
      router.push("/account/plans");
      return;
    }

    setIsOpen(!isOpen);
  };

  const quickActions = [
    {
      icon: <Brain className="w-4 h-4" />,
      label: "Ask Question",
      path: "/account/ai-assistant",
      description: "Get instant answers",
      color: "text-primary",
    },
    {
      icon: <Book className="w-4 h-4" />,
      label: "Generate Quiz",
      action: (query) =>
        router.push(
          `/account/ai-assistant?type=quiz&q=${encodeURIComponent(query)}`
        ),
      description: "Create practice quizzes",
      color: "text-success",
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Study Plan",
      action: (query) =>
        router.push(
          `/account/ai-assistant?type=study_plan&q=${encodeURIComponent(query)}`
        ),
      description: "Get personalized plans",
      color: "text-info",
    },
    {
      icon: <Target className="w-4 h-4" />,
      label: "Topic Focus",
      action: (query) =>
        router.push(
          `/account/ai-assistant?type=explain&q=${encodeURIComponent(query)}`
        ),
      description: "Deep dive into topics",
      color: "text-warning",
    },
  ];

  const handleNewChat = async () => {
    try {
      await fetch("/api/v1/members/ai-assistant", { method: "DELETE" });
      setCurrentChat(null);
      router.push("/account/ai-assistant");
    } catch (error) {
      toast.error("Failed to start new chat");
    }
  };

  if (shouldHide) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main Popup */}
      {isOpen && !isMinimized && (
        <div className="bg-base-200 rounded-lg shadow-lg p-4 mb-4 w-[320px] animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Bot size={20} className="text-primary" />
              AI Study Assistant
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleNewChat}
                className="btn btn-ghost btn-xs"
                title="New Chat"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="btn btn-ghost btn-xs"
                title="Recent Queries"
              >
                <History size={14} />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="btn btn-ghost btn-xs"
                title="Minimize"
              >
                <Minimize2 size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-xs"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Current Chat Preview */}
          {currentChat && (
            <div className="bg-base-300 rounded-lg p-3 mb-4 text-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">Current Chat</span>
                <span className="text-xs opacity-70">
                  {new Date(currentChat.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="line-clamp-2 opacity-80">{currentChat.query}</p>
            </div>
          )}

          {showHistory ? (
            // Recent Queries Section
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-500">
                  Recent Queries
                </h4>
                <button
                  onClick={async () => {
                    if (confirm("Clear chat history?")) {
                      await fetch("/api/v1/members/ai-assistant", {
                        method: "DELETE",
                      });
                      setRecentQueries([]);
                      localStorage.removeItem("aiRecentQueries");
                      toast.success("Chat history cleared");
                    }
                  }}
                  className="btn btn-ghost btn-xs"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {recentQueries.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">
                  No recent queries
                </p>
              ) : (
                recentQueries.map((query, index) => (
                  <div
                    key={index}
                    className="text-sm p-2 bg-base-300 rounded-lg hover:bg-base-100 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      router.push(
                        `/account/ai-assistant?q=${encodeURIComponent(query)}`
                      );
                    }}
                  >
                    <History size={14} className="opacity-50" />
                    <span className="line-clamp-1">{query}</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Quick Actions
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() =>
                    action.action ? action.action("") : router.push(action.path)
                  }
                  className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-base-300 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${action.color}/10`}>
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.label}</div>
                    <div className="text-xs text-gray-500">
                      {action.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Quick Input */}
          <div className="mt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const query = e.target.query.value;
                if (query.trim()) {
                  const updated = [query, ...recentQueries.slice(0, 4)];
                  setRecentQueries(updated);
                  localStorage.setItem(
                    "aiRecentQueries",
                    JSON.stringify(updated)
                  );
                  router.push(
                    `/account/ai-assistant?q=${encodeURIComponent(query)}`
                  );
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                name="query"
                placeholder="Ask anything..."
                className="input input-bordered input-sm flex-1"
              />
              <button type="submit" className="btn btn-primary btn-sm gap-2">
                <Sparkles size={14} />
                Ask
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Minimized State */}
      {isOpen && isMinimized && (
        <div className="bg-base-200 rounded-lg shadow-lg p-2 mb-4 animate-in slide-in-from-bottom-5">
          <button
            onClick={() => setIsMinimized(false)}
            className="btn btn-ghost btn-sm gap-2"
          >
            <Maximize2 size={14} />
            <span className="ml-2">AI Assistant</span>
          </button>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={handleClick}
        className={`btn btn-circle btn-lg ${
          isOpen ? "btn-primary" : "btn-primary hover:btn-primary"
        } shadow-lg`}
        aria-label="AI Assistant"
      >
        <Bot size={24} />
      </button>
    </div>
  );
}

FloatingAIButton.displayName = "FloatingAIButton";
