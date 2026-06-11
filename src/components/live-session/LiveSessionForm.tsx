"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useGenerateLiveSessionMutation } from "@/redux/features/ai/aiApi";
import { SessionFormValues } from "@/interfaces/liveSession.interfce";

interface LiveSessionFormProps {
  initialData?: any;
  onSubmit: SubmitHandler<SessionFormValues>;
  isLoading?: boolean;
  onSuccess?: () => void;
}

// ================= HELPERS =================
const toDateInput = (date: string | Date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const toTimeInput = (date: string | Date) => {
  if (!date) return "";
  return new Date(date).toTimeString().slice(0, 5);
};

const toArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
};

export function LiveSessionForm({
  initialData,
  onSubmit,
  isLoading,
  onSuccess,
}: LiveSessionFormProps) {
  const { t } = useTranslation();
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  const [generateLiveSession, { isLoading: isGenerating }] =
    useGenerateLiveSessionMutation();

  const [thumbPreview, setThumbPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<SessionFormValues>({
    defaultValues: {
      title: "",
      description: "",
      sessionDate: "",
      sessionTime: "",
      registrationDeadlineDate: "",
      registrationDeadlineTime: "",
      maxCapacity: 0,
      meetingLink: "",
      isPublished: false,
      level: "BEGINNER",
      learningOutcomes: [],
      whoShouldAttend: [],
      keyTopics: [],
    },
  });

  // ================= EDIT MODE AUTO FILL =================
  useEffect(() => {
    if (!initialData) return;

    const sessionDate = initialData.sessionDate
      ? new Date(initialData.sessionDate)
      : null;

    const regDate = initialData.registrationDeadline
      ? new Date(initialData.registrationDeadline)
      : null;

    reset({
      title: initialData.title || "",
      description: initialData.description || "",
      sessionDate: sessionDate ? toDateInput(sessionDate) : "",
      sessionTime: sessionDate ? toTimeInput(sessionDate) : "",
      registrationDeadlineDate: regDate ? toDateInput(regDate) : "",
      registrationDeadlineTime: regDate ? toTimeInput(regDate) : "",
      maxCapacity: initialData.maxCapacity || 0,
      meetingLink: initialData.meetingLink || "",
      isPublished: initialData.isPublished || false,
      level: initialData.level || "BEGINNER",
      learningOutcomes: toArray(initialData.learningOutcomes),
      whoShouldAttend: toArray(initialData.whoShouldAttend),
      keyTopics: toArray(initialData.keyTopics),
    });

    setThumbPreview(initialData.thumbnail || null);
  }, [initialData, reset]);

  // ================= DRAFT RESTORE =================
  useEffect(() => {
    if (initialData) return;

    const draft = localStorage.getItem("liveSessionDraft");
    if (!draft) return;

    try {
      const data = JSON.parse(draft);
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    } catch { }
  }, [initialData, setValue]);

  // ================= AUTO DRAFT SAVE =================
  useEffect(() => {
    if (initialData) return;
    if (hasSubmitted) return; // stop saving draft after successful submit

    const sub = watch((value) => {
      localStorage.setItem("liveSessionDraft", JSON.stringify(value));
    });

    return () => sub.unsubscribe();
  }, [watch, initialData, hasSubmitted]);

  // ================= THUMB =================
  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("thumbnailFile", file as any);

    const reader = new FileReader();
    reader.onload = () => setThumbPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ================= ARRAY INPUT =================
  const handleArrayChange = (field: keyof SessionFormValues, value: string) => {
    const arr = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    setValue(field as any, arr);
  };

  // ================= SUBMIT =================
  const submitHandler: SubmitHandler<SessionFormValues> = async (data) => {
    try {
      await onSubmit(data);
      reset();
      setThumbPreview(null);
      localStorage.removeItem("liveSessionDraft");
      setHasSubmitted(true);
    } catch (err) {
      // Errors are caught and handled by the parent component's onSubmit handler
    }
  };

  // ================= AI =================
  const handleAIGenerate = async () => {
    const title = watch("title");
    const desc = watch("description");

    if (!title && !desc) {
      toast.error("Write something first");
      return;
    }

    try {
      const res = await generateLiveSession({
        title: `${title} ${desc}`,
      }).unwrap();

      const ai = res?.data?.data;
      if (!ai) return;

      if (ai.title) setValue("title", ai.title);
      if (ai.fullDescription) setValue("description", ai.fullDescription);
      if (ai.level) setValue("level", ai.level);

      if (ai.learningOutcomes)
        setValue("learningOutcomes", toArray(ai.learningOutcomes));

      if (ai.whoShouldAttend)
        setValue("whoShouldAttend", toArray(ai.whoShouldAttend));

      if (ai.keyTopics)
        setValue("keyTopics", toArray(ai.keyTopics));

      toast.success("AI generated!");
    } catch {
      toast.error("AI failed");
    }
  };

  // ================= UI =================
  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">

      {/* TITLE + AI */}
      <div className="flex justify-between items-center">
        <label className="font-bold">Title</label>

        <button
          type="button"
          onClick={handleAIGenerate}
          disabled={isGenerating}
          className={`relative overflow-hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
            isGenerating
              ? "bg-gradient-to-r from-orange-600 via-amber-500 to-rose-600 text-white shadow-lg shadow-orange-500/35 scale-105 animate-shimmer"
              : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 hover:border-primary/40"
          }`}
        >
          {isGenerating ? (
            <>
              <Sparkles size={13} className="animate-spin text-white" />
              <span>AI Generating...</span>
            </>
          ) : (
            <>
              <Sparkles size={13} className="animate-bounce text-primary" />
              <span>AI Generate</span>
            </>
          )}
        </button>
      </div>

      <Input 
        {...register("title")} 
        className={isGenerating ? "animate-ai-input" : ""}
      />

      {/* DESCRIPTION */}
      <Textarea 
        {...register("description")} 
        className={isGenerating ? "animate-ai-input" : ""}
      />

      {/* DATE / TIME */}
      <div className="grid grid-cols-2 gap-4">
        <Input type="date" {...register("sessionDate")} />
        <Input type="time" {...register("sessionTime")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input type="date" {...register("registrationDeadlineDate")} />
        <Input type="time" {...register("registrationDeadlineTime")} />
      </div>

      {/* THUMB */}
      <Input type="file" onChange={handleThumbChange} />
      {thumbPreview && (
        <img src={thumbPreview} className="w-20 h-16 object-cover rounded" />
      )}

      {/* CAPACITY */}
      <Input type="number" {...register("maxCapacity")} />

      {/* LINK */}
      <Input {...register("meetingLink")} />

      {/* LEVEL */}
      <select 
        {...register("level")} 
        className={`w-full h-12 rounded ${isGenerating ? "animate-ai-input" : ""}`}
      >
        <option value="BEGINNER">Beginner</option>
        <option value="INTERMEDIATE">Intermediate</option>
        <option value="ADVANCED">Advanced</option>
      </select>

      {/* ARRAYS (FIXED) */}
      <Textarea
        value={watch("learningOutcomes")?.join(", ")}
        onChange={(e) => handleArrayChange("learningOutcomes", e.target.value)}
        placeholder="Learning outcomes"
        className={isGenerating ? "animate-ai-input" : ""}
      />

      <Textarea
        value={watch("whoShouldAttend")?.join(", ")}
        onChange={(e) => handleArrayChange("whoShouldAttend", e.target.value)}
        placeholder="Who should attend"
        className={isGenerating ? "animate-ai-input" : ""}
      />

      <Textarea
        value={watch("keyTopics")?.join(", ")}
        onChange={(e) => handleArrayChange("keyTopics", e.target.value)}
        placeholder="Key topics"
        className={isGenerating ? "animate-ai-input" : ""}
      />

      {/* PUBLISH */}
      <div className="flex gap-2">
        <Checkbox
          checked={watch("isPublished")}
          onCheckedChange={(v) => setValue("isPublished", !!v)}
        />
        Publish
      </div>

      {/* SUBMIT */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Saving...
          </>
        ) : initialData ? (
          "Update Session"
        ) : (
          "Create Session"
        )}
      </Button>
    </form>
  );
}