"use client";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetEnrolledCourseContentQuery, useSubmitAssignmentMutation, useSubmitQuizMutation } from "@/redux/features/enroll/enrollApi";
import { useCompleteLessonMutation } from "@/redux/features/course/courseAPi";
import {
  PlayCircle, CheckCircle, Lock, Loader2, ChevronDown, ChevronRight, BookOpen,
  AlertCircle, Award, CheckCircle2, ChevronLeft, ArrowLeft, ArrowRight, Send
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import QuizGeneratorModal from "@/components/shared/QuizGeneratorModal";
import { Sparkles } from "lucide-react";

// Flatten all navigable items from modules into a single ordered list
type NavItem = { id: string; type: 'lesson'  | 'assignment'; data: any; moduleId: string };

export default function CoursePlayerPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  console.log("CoursePlayerPage params:", params);

  const { data: courseResponse, isLoading, isError, refetch } = useGetEnrolledCourseContentQuery(courseId, { skip: !courseId });
  const [completeLesson, { isLoading: isCompleting }] = useCompleteLessonMutation();
  const [submitAssignment, { isLoading: isSubmittingAssignment }] = useSubmitAssignmentMutation();
  const [submitQuiz, { isLoading: isSubmittingQuiz }] = useSubmitQuizMutation();

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isCourseCompletedMode, setIsCourseCompletedMode] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; percentage: number } | null>(null);

  // Assignment state
  const [assignmentContent, setAssignmentContent] = useState("");
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const course = courseResponse?.data;

  // Build flat navigation list
  const navItems: NavItem[] = useMemo(() => {
    if (!course?.modules) return [];
    const items: NavItem[] = [];
    for (const mod of course.modules) {
      if (mod.lessons) {
        for (const les of mod.lessons) {
          items.push({ id: les.id, type: 'lesson', data: les, moduleId: mod.id });
        }
      }
      if (mod.assignment) {
        items.push({ id: mod.assignment.id, type: 'assignment', data: mod.assignment, moduleId: mod.id });
      }
    
    }
    return items;
  }, [course]);

  const activeItem = navItems[activeIndex] || null;

  // Initialize: find first unlocked incomplete lesson
  useEffect(() => {
    if (navItems.length > 0 && !activeItem) {
      const idx = navItems.findIndex(n => n.type === 'lesson' && !n.data.isCompleted && n.data.isUnlocked);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  }, [navItems]);

  // Expand the module of the active item
  useEffect(() => {
    if (activeItem && !expandedModules.includes(activeItem.moduleId)) {
      setExpandedModules(prev => [...prev, activeItem.moduleId]);
    }
  }, [activeItem]);

  // Reset quiz/assignment state when active item changes
  useEffect(() => {
    setQuizAnswers({});
    setQuizResult(null);
    setAssignmentContent("");
    setAssignmentSubmitted(false);
  }, [activeIndex]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const goToItem = (index: number) => {
    const item = navItems[index];
    if (item.type === 'lesson' && !item.data.isUnlocked) {
      toast.error(t("student.player.locked_toast"));
      return;
    }
    setActiveIndex(index);
    setIsCourseCompletedMode(false);
  };

  const goNextAndComplete = async () => {
    if (!activeItem) return;

    if (activeItem.type === 'lesson' && !activeItem.data.isCompleted) {
      try {
        await completeLesson({ courseId, lessonId: activeItem.id }).unwrap();
        toast.success(t("student.player.completed_toast"));
        refetch();
      } catch (err: any) {
         toast.error(err?.data?.message || t("student.player.failed_complete"));
         return;
      }
    }

    if (activeIndex < navItems.length - 1) {
       goToItem(activeIndex + 1);
    } else {
       setIsCourseCompletedMode(true);
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) goToItem(activeIndex - 1);
  };

  const handleSubmitAssignment = async () => {
    if (!activeItem || activeItem.type !== 'assignment') return;
    if (!assignmentContent.trim()) {
      toast.error(t("student.player.write_answer_toast"));
      return;
    }
    try {
      await submitAssignment({ assignmentId: activeItem.id, content: assignmentContent }).unwrap();
      toast.success(t("student.player.success_submit_toast"));
      setAssignmentSubmitted(true);
    } catch (err: any) {
      toast.error(err?.data?.message || t("student.player.failed_submit_toast"));
    }
  };



  // Embed URL helper
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const ytMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1`;
    }
    return url;
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] items-center justify-center">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold">{t("student.player.failed_load")}</h2>
        <p className="text-muted-foreground mt-2">{t("student.player.not_enrolled")}</p>
        <Link href="/dashboard/student/my-courses" className="mt-6 px-6 py-2 bg-primary text-white rounded-lg">{t("student.player.go_back")}</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] bg-background border border-border rounded-[2rem] overflow-hidden shadow-2xl relative">

      {/* ========== SIDEBAR ========== */}
      <div className="w-full lg:w-96 border-r flex flex-col bg-card overflow-hidden">
        <div className="p-5 border-b bg-card z-10 shrink-0">
          <Link href="/dashboard/student/my-courses" className="text-xs flex items-center text-muted-foreground hover:text-primary mb-3 transition-colors">
            <ChevronLeft className="w-3 h-3 mr-1" /> {t("student.player.back_to_courses")}
          </Link>
          <h2 className="font-bold text-lg line-clamp-2">{course.title}</h2>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span>{t("student.player.progress")}</span>
              <span className="text-primary">
                {(() => {
                  const total = course.modules?.reduce((a: number, m: any) => a + m.lessonCount, 0) || 1;
                  const done = course.modules?.reduce((a: number, m: any) => a + m.completedCount, 0) || 0;
                  return Math.round((done / total) * 100);
                })()}%
              </span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
                style={{
                  width: `${(() => {
                    const total = course.modules?.reduce((a: number, m: any) => a + m.lessonCount, 0) || 1;
                    const done = course.modules?.reduce((a: number, m: any) => a + m.completedCount, 0) || 0;
                    return Math.round((done / total) * 100);
                  })()}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {course.modules?.map((module: any, mIndex: number) => {
            const isExpanded = expandedModules.includes(module.id);
            return (
              <div key={module.id} className="border border-border rounded-xl bg-background overflow-hidden">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-3 bg-secondary/30 hover:bg-secondary/60 transition-colors text-left"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm leading-tight text-foreground truncate">
                      M{mIndex + 1}: {module.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {module.completedCount}/{module.lessonCount} {t("student.player.done")}
                    </p>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="p-2 space-y-0.5">
                    {module.lessons?.map((lesson: any) => {
                      const navIdx = navItems.findIndex(n => n.id === lesson.id);
                      const isActive = activeIndex === navIdx;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => goToItem(navIdx)}
                          disabled={!lesson.isUnlocked}
                          className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all text-sm ${isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-muted border border-transparent"} ${!lesson.isUnlocked ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <div className="shrink-0">
                            {lesson.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : lesson.isUnlocked ? (
                              <PlayCircle className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            ) : (
                              <Lock className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <span className={`truncate ${isActive ? "text-primary font-semibold" : "text-foreground"}`}>{lesson.title}</span>
                          <span className="ml-auto text-[10px] text-muted-foreground whitespace-nowrap">{lesson.duration}{t("student.player.mins")}</span>
                        </button>
                      );
                    })}

                    {module.quiz && (() => {
                      const navIdx = navItems.findIndex(n => n.id === module.quiz.id);
                      const isActive = activeIndex === navIdx;
                      return (
                        <button key={`quiz-${module.quiz.id}`} onClick={() => goToItem(navIdx)}
                          className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all text-sm mt-1 ${isActive ? "bg-amber-500/10 border border-amber-500/20" : "hover:bg-muted border border-transparent"}`}>
                          <Award className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="truncate font-medium">{t("student.player.quiz")}</span>
                        </button>
                      );
                    })()}

                    {module.assignment && (() => {
                      const navIdx = navItems.findIndex(n => n.id === module.assignment.id);
                      const isActive = activeIndex === navIdx;
                      return (
                        <button key={`asgn-${module.assignment.id}`} onClick={() => goToItem(navIdx)}
                          className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all text-sm mt-0.5 ${isActive ? "bg-purple-500/10 border border-purple-500/20" : "hover:bg-muted border border-transparent"}`}>
                          <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />
                          <span className="truncate font-medium">{t("student.player.assignment")}</span>
                        </button>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {isCourseCompletedMode ? (
           <div className="flex flex-col flex-1 items-center justify-center text-center p-10 bg-background">
             <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
               <CheckCircle2 className="w-12 h-12 text-emerald-500" />
             </div>
             <h3 className="text-3xl font-black text-foreground mb-4">{t("student.player.course_completed")}</h3>
             <p className="text-muted-foreground max-w-md font-medium">
               {t("student.player.completion_desc")}
             </p>
           </div>
        ) : activeItem ? (
          <>
            <div className="flex-1 overflow-y-auto">

              {/* ===== LESSON VIEW ===== */}
              {activeItem.type === 'lesson' && (
                <div className="w-full flex flex-col">
                  <div className="w-full bg-zinc-950 aspect-video relative flex items-center justify-center shadow-md">
                    {activeItem.data.videoUrl ? (
                      <iframe
                        src={getEmbedUrl(activeItem.data.videoUrl)!}
                        className="w-full h-full absolute inset-0"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground p-10">
                        <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-20" />
                        <p>{t("student.player.no_video")}</p>
                      </div>
                    )}
                  </div>

                  <div className="max-w-4xl w-full mx-auto p-6 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">

                      <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-black text-foreground">{activeItem.data.title}</h1>
                        <div className="flex gap-3">
                          <span className="px-3 py-1 bg-secondary text-xs font-bold uppercase tracking-widest rounded-full">{activeItem.data.duration} {t("student.player.mins")}</span>
                          {activeItem.data.isCompleted && (
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {t("student.player.completed")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsQuizOpen(true)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 text-amber-600 rounded-xl font-bold text-sm hover:bg-amber-500 hover:text-white transition-all border border-amber-500/20 shadow-lg shadow-amber-500/5"
                        >
                          <Sparkles size={16} className="animate-pulse" />
                          Generate Quiz
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <QuizGeneratorModal
                lessonId={activeItem?.id}
                isOpen={isQuizOpen}
                onClose={() => setIsQuizOpen(false)}
              />

         

              {/* ===== ASSIGNMENT VIEW ===== */}
              {activeItem.type === 'assignment' && (
                <div className="max-w-3xl w-full mx-auto p-6 md:p-10 space-y-8">
                  <div className="flex items-center gap-4 bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20">
                    <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-black text-foreground">{t("student.player.assignment")}</h1>
                      <p className="text-sm text-purple-500 font-bold uppercase tracking-widest">{t("student.player.practical_task")}</p>
                    </div>
                  </div>

                  <div className="bg-card border rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t("student.player.instructions")}</h3>
                    <div className="bg-secondary/30 p-5 rounded-xl border border-border/50 text-foreground whitespace-pre-wrap">
                      {activeItem.data.description || t("student.player.no_instructions")}
                    </div>
                  </div>

                  {assignmentSubmitted ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center space-y-3">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                      <h3 className="text-xl font-bold text-foreground">{t("student.player.submitted")}</h3>
                      <p className="text-muted-foreground">{t("student.player.review_soon")}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        className="w-full bg-background border border-border rounded-xl p-4 min-h-[200px] focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-y"
                        placeholder={activeItem.data.submissionType === 'link' ? t("student.player.placeholder_link") : t("student.player.placeholder_text")}
                        value={assignmentContent}
                        onChange={(e) => setAssignmentContent(e.target.value)}
                      />
                      <button
                        onClick={handleSubmitAssignment}
                        disabled={isSubmittingAssignment}
                        className="w-full py-4 bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20"
                      >
                        {isSubmittingAssignment ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {t("student.player.submit")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ========== BOTTOM NAV: PREV / NEXT ========== */}
            <div className="shrink-0 border-t border-border bg-card px-6 py-3 flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={activeIndex === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeIndex === 0 ? 'opacity-30 cursor-not-allowed bg-secondary text-muted-foreground' : 'bg-secondary hover:bg-muted text-foreground'}`}
              >
                <ArrowLeft className="w-4 h-4" /> {t("student.player.previous")}
              </button>

              <span className="text-xs text-muted-foreground font-medium hidden sm:block">
                {activeIndex + 1} / {navItems.length}
              </span>

              <button
                onClick={goNextAndComplete}
                disabled={isCourseCompletedMode || (activeItem?.type === 'lesson' && isCompleting)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20`}
              >
                {activeItem?.type === 'lesson' && isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {activeIndex >= navItems.length - 1 ? t("student.player.finish") : t("student.player.next")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center text-muted-foreground p-10 text-center">
            <PlayCircle className="w-16 h-16 opacity-20 mb-4" />
            <h2 className="text-xl font-bold text-foreground">{t("student.player.select_lesson")}</h2>
          </div>
        )}
      </div>
    </div>
  );
}
