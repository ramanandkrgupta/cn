"use client";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Send, Bot, Loader } from "lucide-react";
import { toast } from "sonner";
import ClientWrapper from "@/components/providers/ClientWrapper";

function AIAssistantContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const userMessage = { role: "user", content: query };
    setConversation(prev => [...prev, userMessage]);
    setQuery("");

    try {
      const response = await fetch("/api/v1/members/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get response");
      }

      const data = await response.json();
      setConversation(prev => [...prev, {
        role: "assistant",
        content: data.response
      }]);

    } catch (error) {
      toast.error(error.message || "Failed to get AI response");
      setConversation(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Bot size={32} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold">AI Study Assistant</h1>
          <p className="text-gray-500">Your personal study companion</p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-base-200 rounded-lg p-4 mb-4 min-h-[60vh] max-h-[60vh] overflow-y-auto">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}
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
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            <Send />
          )}
        </button>
      </form>
    </div>
  );
}

export default function AIAssistant() {
  return (
    <ClientWrapper requirePro>
      <AIAssistantContent />
    </ClientWrapper>
  );
}