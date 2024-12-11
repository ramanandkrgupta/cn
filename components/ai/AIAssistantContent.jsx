"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, Bot, Loader, History } from "lucide-react";
import toast from "react-hot-toast";

export default function AIAssistantContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!session) return;

    if (session?.user?.role !== "PRO") {
      router.push("/account/plans");
      toast.error("AI Assistant is a PRO feature");
      return;
    }

    fetchHistory();

    const initialQuery = searchParams.get("q");
    if (initialQuery) {
      handleSubmit(null, initialQuery);
    }
  }, [session, router]);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/v1/members/ai-assistant");
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();

      const conversationHistory = data.flatMap((item) => [
        { role: "user", content: item.query },
        { role: "assistant", content: item.response },
      ]);

      setConversation(conversationHistory);
    } catch (error) {
      toast.error("Failed to load conversation history");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmit = async (e, initialQuery = null) => {
    if (e) e.preventDefault();
    const messageToSend = initialQuery || query;
    if (!messageToSend.trim()) return;

    setLoading(true);
    const userMessage = { role: "user", content: messageToSend };
    setConversation((prev) => [...prev, userMessage]);
    setQuery("");

    try {
      const response = await fetch("/api/v1/members/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
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
        },
      ]);

      const recentQueries = JSON.parse(
        localStorage.getItem("aiRecentQueries") || "[]"
      );
      const updatedQueries = [messageToSend, ...recentQueries.slice(0, 4)];
      localStorage.setItem("aiRecentQueries", JSON.stringify(updatedQueries));
    } catch (error) {
      toast.error(error.message || "Failed to get AI response");
      setConversation((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bot size={32} className="text-primary" />
          <div>
            <h1 className="text-2xl font-bold">AI Study Assistant</h1>
            <p className="text-gray-500">Your personal study companion</p>
          </div>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="btn btn-ghost btn-sm gap-2"
        >
          <History size={16} />
          History
        </button>
      </div>

      {/* Chat Interface */}
      <div className="bg-base-200 rounded-lg p-4 mb-4 min-h-[60vh] max-h-[60vh] overflow-y-auto">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block max-w-[80%] p-3 rounded-lg ${
                msg.role === "user" ? "bg-primary text-white" : "bg-base-300"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about your studies..."
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
