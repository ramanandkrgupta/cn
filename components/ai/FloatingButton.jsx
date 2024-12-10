"use client";
import { useState } from 'react';
import { Bot, X, Minimize2, Maximize2 } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function FloatingAIButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleClick = () => {
    if (!session) {
      toast.error("Please login to use AI Assistant");
      return;
    }
    
    if (session.user.role !== 'PRO') {
      toast.error("AI Assistant is a PRO feature");
      router.push('/account/plans');
      return;
    }

    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Quick Actions Popup */}
      {isOpen && !isMinimized && (
        <div className="bg-base-200 rounded-lg shadow-lg p-4 mb-4 w-[320px] animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Bot size={20} className="text-primary" />
              AI Assistant
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsMinimized(true)}
                className="btn btn-ghost btn-xs"
              >
                <Minimize2 size={14} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-xs"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-2">
            <button
              onClick={() => router.push('/account/ai-assistant')}
              className="w-full btn btn-sm justify-start hover:bg-base-300"
            >
              Ask a Question
            </button>
            <button
              onClick={() => router.push('/account/ai-assistant/quiz')}
              className="w-full btn btn-sm justify-start hover:bg-base-300"
            >
              Generate Quiz
            </button>
            <button
              onClick={() => router.push('/account/ai-assistant/enhance')}
              className="w-full btn btn-sm justify-start hover:bg-base-300"
            >
              Enhance Notes
            </button>
          </div>
        </div>
      )}

      {/* Minimized State */}
      {isOpen && isMinimized && (
        <div className="bg-base-200 rounded-lg shadow-lg p-2 mb-4 animate-in slide-in-from-bottom-5">
          <button 
            onClick={() => setIsMinimized(false)}
            className="btn btn-ghost btn-sm"
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
          isOpen ? 'btn-primary' : 'btn-primary hover:btn-primary'
        } shadow-lg`}
        aria-label="AI Assistant"
      >
        <Bot size={24} />
      </button>
    </div>
  );
}