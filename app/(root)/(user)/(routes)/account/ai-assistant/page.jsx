"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Send, Bot, Loader } from "lucide-react";

export default function AIAssistant() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);

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

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setConversation(prev => [...prev, {
        role: "assistant",
        content: data.response
      }]);
    } catch (error) {
      toast.error("Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI Study Assistant</h1>

      {/* Chat Interface */}
      <div className="bg-base-200 rounded-lg p-4 mb-4 h-[60vh] overflow-y-auto">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-base-300"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
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