"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  X,
  MessageSquare,
  Sparkles,
  Mic as MicIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAppSelector } from "@/redux/hooks";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const AiAssistant = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { token } = useAppSelector((state) => state.mentoroAuth);

  /** Auto‑scroll to the latest message */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  /** Clean up speech recognition on unmount */
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  /** Send a text message to the AI backend */
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Stop listening if user clicks send
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage = { role: "user", content: message };
    const currentMessage = message; // keep a copy for the API call
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const API_URL =
        typeof window !== "undefined"
          ? "/api"
          : `${process.env.NEXT_PUBLIC_API_URL}/api`;
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: currentMessage,
          history: chatHistory,
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      // placeholder for the assistant response
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
                  const lastIdx = newHistory.length - 1;
                  newHistory[lastIdx] = {
                    ...newHistory[lastIdx],
                    content: aiContent,
                  };
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
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || t("ai_assistant.error_msg"));
    } finally {
      setIsLoading(false);
    }
  };

  /** Toggle client-side speech recognition */
  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech Recognition is not supported by your browser. Please try Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    // Detect language preference
    const currentLang = typeof window !== "undefined" ? localStorage.getItem("i18nextLng") || "en" : "en";
    recognition.lang = currentLang.startsWith("bn") ? "bn-BD" : "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      toast.success(currentLang.startsWith("bn") ? "কথা বলা শুরু করুন..." : "Listening... Start speaking.");
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event);
      if (event.error !== "no-speech") {
        toast.error("Speech recognition error: " + event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let currentText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript;
      }
      if (currentText) {
        setMessage(currentText);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
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
                <h3 className="font-black text-sm uppercase tracking-widest">
                  {t("ai_assistant.mentor_title")}
                </h3>
                <p className="text-[10px] opacity-80 font-bold uppercase tracking-tighter">
                  {t("ai_assistant.status_ready")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat window"
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
                  <p className="font-black text-foreground uppercase tracking-widest text-xs">
                    {t("ai_assistant.welcome_title")}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {t("ai_assistant.welcome_desc")}
                  </p>
                </div>
              </div>
            )}

            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.role === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
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
                      <ReactMarkdown>{chat.content}</ReactMarkdown>
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
                  <span
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 bg-background border-t border-border/50">
            <div className="flex items-center gap-3 bg-secondary/50 rounded-2xl p-2 border border-border focus-within:border-primary/50 transition-all">
              {/* Mic button to activate voice input */}
              <button
                onClick={toggleSpeechRecognition}
                disabled={isLoading}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
                className={`p-2.5 rounded-xl transition-all shadow-lg duration-300 disabled:opacity-50 mr-2 ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 animate-pulse text-white shadow-red-500/20"
                    : "bg-primary hover:scale-105 active:scale-95 text-primary-foreground shadow-primary/20"
                }`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                <MicIcon size={18} />
              </button>

              {/* Text input */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={isListening ? "Listening..." : t("ai_assistant.placeholder")}
                className="flex-1 bg-transparent border-none px-2 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:ring-0 outline-none font-bold"
              />

              {/* Send button */}
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                aria-label="Send message"
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
         aria-label="Toggle AI assistant"
        className="bg-primary text-primary-foreground p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(var(--primary),0.3)] hover:scale-110 active:scale-90 transition-all duration-500 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        {isOpen ? (
          <X size={28} className="relative z-10" />
        ) : (
          <MessageSquare size={28} className="relative z-10" />
        )}
      </button>
    </div>
  );
};

export default AiAssistant;
