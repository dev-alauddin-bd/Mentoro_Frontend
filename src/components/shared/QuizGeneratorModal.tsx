"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

// ─── Module-level cache ───────────────────────────────────────────────────────
// Persists across modal open/close within the same browser session.
// Key: lessonId  |  Value: QuizQuestion[]
const sessionQuizCache = new Map<string, QuizQuestion[]>();
// ─────────────────────────────────────────────────────────────────────────────

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Props {
  lessonId: string;
  isOpen: boolean;
  onClose: () => void;
}

const QuizGeneratorModal = ({ lessonId, isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const { token } = useAppSelector((state) => state.mentoroAuth);

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── Reset quiz state (reuse cached questions or start fresh) ────────────────
  const resetState = (questions: QuizQuestion[]) => {
    setQuiz(questions);
    setCurrentQuestion(0);
    setScore(0);
    setIsFinished(false);
    setSelectedAnswer(null);
  };

  // ── Fetch from API (only called when cache is empty or force=true) ──────────
  const fetchFromAPI = async (): Promise<QuizQuestion[]> => {
    const API_URL =
      typeof window !== "undefined"
        ? "/api"
        : `${process.env.NEXT_PUBLIC_API_URL}/api`;

    const response = await axios.get(
      `${API_URL}/ai/generate-quiz/${lessonId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data.data as QuizQuestion[];
  };

  // ── Main generate function ──────────────────────────────────────────────────
  // force=true  → bypass cache, fetch fresh (used by "Retry" button)
  // force=false → use cache if available (used on modal open)
  const generateQuiz = async (force = false) => {
    // ① Use cached quiz if available and not forced
    if (!force && sessionQuizCache.has(lessonId)) {
      resetState(sessionQuizCache.get(lessonId)!);
      return;
    }

    // ② Fetch from backend (which itself has a 24-hour server-side cache)
    setIsLoading(true);
    setQuiz([]);
    setCurrentQuestion(0);
    setScore(0);
    setIsFinished(false);
    setSelectedAnswer(null);

    try {
      const questions = await fetchFromAPI();
      sessionQuizCache.set(lessonId, questions); // store in session cache
      resetState(questions);
    } catch (error: any) {
      console.error("Quiz Error:", error);
      toast.error(error?.response?.data?.message || t("ai_quiz.error"));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Auto-load when modal opens ──────────────────────────────────────────────
  React.useEffect(() => {
    if (isOpen && lessonId) {
      generateQuiz(false); // uses cache if available
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, lessonId]);

  // ── Answer handling ─────────────────────────────────────────────────────────
  const handleAnswer = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    if (option === quiz[currentQuestion].correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card dark:bg-card rounded-3xl overflow-hidden p-0 border-none shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-orange-600 p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-black">
              <Sparkles className="animate-pulse" /> {t("ai_quiz.title")}
            </DialogTitle>
          </DialogHeader>
          <p className="opacity-80 text-sm mt-1">{t("ai_quiz.subtitle")}</p>
        </div>

        <div className="p-8">
          {/* Loading */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Sparkles
                  className="absolute inset-0 m-auto text-primary animate-bounce"
                  size={24}
                />
              </div>
              <p className="text-muted-foreground font-medium animate-pulse">
                {t("ai_quiz.crafting")}
              </p>
            </div>
          ) : isFinished ? (
            /* Results */
            <div className="text-center py-6 space-y-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl font-black text-primary">
                  {Math.round((score / quiz.length) * 100)}%
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  {t("ai_quiz.completed_title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("ai_quiz.score_text", { score, total: quiz.length })}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                {/* Retry: force=true → fresh AI call, clears cache for this lesson */}
                <button
                  onClick={() => {
                    sessionQuizCache.delete(lessonId); // clear client cache
                    generateQuiz(true);                // force fresh fetch
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:opacity-80 transition-all"
                >
                  <RefreshCw size={18} /> {t("ai_quiz.retry")}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/30"
                >
                  {t("ai_quiz.done")}
                </button>
              </div>
            </div>
          ) : quiz.length > 0 ? (
            /* Questions */
            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>
                  {t("ai_quiz.question_count", {
                    current: currentQuestion + 1,
                    total: quiz.length,
                  })}
                </span>
                <span className="text-primary">
                  {t("ai_quiz.score_label", { score })}
                </span>
              </div>

              <h3 className="text-lg font-bold text-foreground leading-tight">
                {quiz[currentQuestion].question}
              </h3>

              <div className="grid gap-3">
                {quiz[currentQuestion].options.map((option, idx) => {
                  const isCorrect =
                    option === quiz[currentQuestion].correctAnswer;
                  const isSelected = selectedAnswer === option;
                  const showResult = selectedAnswer !== null;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-2xl text-left font-medium transition-all border-2 ${
                        showResult
                          ? isCorrect
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-600"
                            : isSelected
                            ? "bg-red-500/10 border-red-500 text-red-600"
                            : "opacity-50 border-border"
                          : "bg-background border-border hover:border-primary hover:bg-primary/5 text-foreground shadow-sm"
                      } flex items-center justify-between`}
                    >
                      {option}
                      {showResult && isCorrect && (
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle size={20} className="text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer && (
                <button
                  onClick={nextQuestion}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl"
                >
                  {currentQuestion < quiz.length - 1
                    ? t("ai_quiz.next_question")
                    : t("ai_quiz.view_result")}{" "}
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              {t("ai_quiz.error")}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizGeneratorModal;
