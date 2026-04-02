"use client";

import { useState, useRef, useEffect } from "react";
import PageWrapper from "@/components/shared/PageWrapper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  ClipboardList,
  GraduationCap,
  BookOpen,
  BarChart3,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type Role = "user" | "agent";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  status?: "thinking" | "done";
}

// --- Suggestion Prompts ---
const suggestions = [
  {
    icon: ClipboardList,
    label: "Grade an essay",
    prompt: "Grade John's essay on climate change out of 50 marks",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    icon: GraduationCap,
    label: "Add a student",
    prompt: "Add a new student: Sarah Johnson, Grade 9, parent email: sarah.mom@gmail.com",
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    iconColor: "text-green-500",
  },
  {
    icon: BookOpen,
    label: "Create lesson plan",
    prompt: "Create a 5 day lesson plan for Grade 8 Mathematics on fractions",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    iconColor: "text-purple-500",
  },
  {
    icon: BarChart3,
    label: "Find struggling students",
    prompt: "Which students are struggling in Mathematics this month?",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    icon: ClipboardList,
    label: "Generate a quiz",
    prompt: "Generate a 10 question MCQ quiz on Photosynthesis for Grade 6",
    color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    icon: Mail,
    label: "Send reports",
    prompt: "Send progress reports to all parents for this month",
    color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    iconColor: "text-yellow-500",
  },
];

// --- Helper ---
function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "agent",
      content:
        "👋 Hi! I'm EduPilot, your AI teaching assistant. I can help you grade assignments, create lesson plans, generate quizzes, analyze student performance, and send parent reports. What would you like to do today?",
      timestamp: new Date(),
      status: "done",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      status: "done",
    };

    const thinkingMessage: Message = {
      id: "thinking",
      role: "agent",
      content: "Thinking...",
      timestamp: new Date(),
      status: "thinking",
    };

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/run`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content }),
        }
      );

      const data = await res.json();

      const agentMessage: Message = {
        id: Date.now().toString(),
        role: "agent",
        content: data.response || "I completed the task!",
        timestamp: new Date(),
        status: "done",
      };

      setMessages((prev) =>
        prev.filter((m) => m.id !== "thinking").concat(agentMessage)
      );
    } catch {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "agent",
        content:
          "⚠️ Could not connect to the backend. Make sure FastAPI is running on http://localhost:8000",
        timestamp: new Date(),
        status: "done",
      };
      setMessages((prev) =>
        prev.filter((m) => m.id !== "thinking").concat(errorMessage)
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Enter key to send
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <PageWrapper title="Agent Chat">
      <div className="flex flex-col h-full max-w-4xl mx-auto" style={{ height: "calc(100vh - 73px)" }}>

        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 items-start",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                    message.role === "agent"
                      ? "bg-blue-500"
                      : "bg-slate-700"
                  )}
                >
                  {message.role === "agent" ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                    message.role === "agent"
                      ? "bg-white border border-slate-200 text-slate-700"
                      : "bg-blue-600 text-white"
                  )}
                >
                  {message.status === "thinking" ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Agent is thinking...</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  )}
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.role === "agent"
                        ? "text-slate-400"
                        : "text-blue-200"
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Suggestion Cards — shown only at start */}
            {showSuggestions && (
              <div className="mt-6">
                <p className="text-sm text-slate-400 mb-3 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Try asking me...
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestions.map((s) => {
                    const Icon = s.icon;
                    return (
                      <Card
                        key={s.label}
                        onClick={() => sendMessage(s.prompt)}
                        className={cn(
                          "p-3 cursor-pointer border transition-colors",
                          s.color
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={cn("w-4 h-4", s.iconColor)} />
                          <p className="text-sm font-medium text-slate-700">
                            {s.label}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 ml-6">
                          {s.prompt}
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="pt-4 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell EduPilot what to do... (Press Enter to send, Shift+Enter for new line)"
              className="resize-none bg-white border-slate-200 min-h-[52px] max-h-32"
              rows={2}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 h-[52px] px-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            EduPilot can make mistakes. Always review AI-generated grades and reports.
          </p>
        </div>

      </div>
    </PageWrapper>
  );
}