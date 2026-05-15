"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageSquare, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAppSelector } from "@/redux/hooks";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const AiAssistant = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { token } = useAppSelector((state) => state.mentoroAuth);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    const currentMessage = message; // Keep a copy for the API call
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: currentMessage, history: chatHistory }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      // Add a placeholder for the AI message
      setChatHistory((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.chunk) {
                aiContent += data.chunk;
                setChatHistory((prev) => {
                  const newHistory = [...prev];
                  const lastIndex = newHistory.length - 1;
                  newHistory[lastIndex] = { ...newHistory[lastIndex], content: aiContent };
                  return newHistory;
                });
              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {
              console.error("Parse error:", e, dataStr);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      toast.error(error.message || t("ai_assistant.error_msg"));
      const errorMessage = {
        role: "assistant",
        content: t("ai_assistant.error_msg"),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[550px] bg-card/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-border/50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
          {/* Header */}
          <div className="p-6 bg-primary text-primary-foreground flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-background/20 p-2 rounded-xl backdrop-blur-md">
                <Bot size={22} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest">{t("ai_assistant.mentor_title")}</h3>
                <p className="text-[10px] opacity-80 font-bold uppercase tracking-tighter">{t("ai_assistant.status_ready")}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-background/20 p-2 rounded-xl transition-all hover:rotate-90 duration-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50">
            {chatHistory.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <div className="bg-primary/10 w-16 h-16 rounded-[2rem] flex items-center justify-center mx-auto text-primary border border-primary/20 shadow-inner">
                  <Sparkles size={32} className="animate-bounce" />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-foreground uppercase tracking-widest text-xs">{t("ai_assistant.welcome_title")}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{t("ai_assistant.welcome_desc")}</p>
                </div>
              </div>
            )}

            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-[1.5rem] text-xs font-medium leading-relaxed shadow-sm ${
                    chat.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-secondary text-foreground border border-border rounded-tl-none"
                  }`}
                >
                  {chat.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-background/50 prose-pre:p-2 prose-pre:rounded-lg">
                      <ReactMarkdown>
                        {chat.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    chat.content
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary p-4 rounded-[1.5rem] rounded-tl-none border border-border flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 bg-background border-t border-border/50">
            <div className="flex items-center gap-3 bg-secondary/50 rounded-2xl p-2 border border-border focus-within:border-primary/50 transition-all">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={t("ai_assistant.placeholder")}
                className="flex-1 bg-transparent border-none px-2 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:ring-0 outline-none font-bold"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-primary hover:scale-105 active:scale-95 text-primary-foreground p-2.5 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-primary-foreground p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(var(--primary),0.3)] hover:scale-110 active:scale-90 transition-all duration-500 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        {isOpen ? <X size={28} className="relative z-10" /> : <MessageSquare size={28} className="relative z-10" />}
      </button>
    </div>
  );
};

export default AiAssistant;
