"use client";

import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";

import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "@/redux/features/course/courseAPi";

import { useGetCategoriesQuery } from "@/redux/features/category/categoriesApi";
import { useGenerateCourseContentMutation } from "@/redux/features/ai/aiApi";

type FormValues = {
  title: string;
  description: string;
  thumbnail?: File;
  previewVideo: string;
  price: number;
  categoryId: string;
  learningOutcomes?: string;
  requirements?: string;
  targetAudience?: string;
  tags?: string;
  hasCertificate?: boolean;

};

const convertToEmbedUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("youtu.be/")) {
    return url.replace("https://youtu.be/", "https://www.youtube.com/embed/");
  }
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

export default function CourseCreateForm({
  onCreated,
  onClose,
  initialData,
}: {
  onCreated?: (courseId: string) => void;
  onClose?: () => void;
  initialData?: any;
}) {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,

  } = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      previewVideo: initialData?.previewVideo || "",
      price: initialData?.price || 0,
      categoryId: initialData?.categoryId || "",
      learningOutcomes: initialData?.learningOutcomes?.join(", ") || "",
      requirements: initialData?.requirements?.join(", ") || "",
      targetAudience: initialData?.targetAudience?.join(", ") || "",
      tags: initialData?.tags?.join(", ") || "",
      hasCertificate: initialData?.hasCertificate || false,

    },
  });

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [generateCourseContent, { isLoading: isGenerating }] =
    useGenerateCourseContentMutation();
  const loading = isCreating || isUpdating;

  const { data: categories, isLoading: catLoading, isError } =
    useGetCategoriesQuery();

  const [thumbPreview, setThumbPreview] = useState<string | null>(
    initialData?.thumbnail || null
  );


  const previewVideoUrl = watch("previewVideo");


  useEffect(() => {
    if (initialData) return;
    const draft = localStorage.getItem('courseDraft');
    if (draft) {
      const data = JSON.parse(draft);
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    }
  }, []);

  useEffect(() => {
    if (initialData) return;

    const sub = watch((value) => {
      const { thumbnail, ...safe } = value as any;
      localStorage.setItem("courseDraft", JSON.stringify(safe));
    });

    return () => sub.unsubscribe();
  }, [watch, initialData]);

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("thumbnail", file);

    const reader = new FileReader();
    reader.onload = () => setThumbPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("previewVideo", data.previewVideo);
      formData.append("price", String(data.price || 0));
      formData.append("categoryId", data.categoryId);

      formData.append(
        "learningOutcomes",
        JSON.stringify(
          data.learningOutcomes?.split(",").map((i) => i.trim()).filter(Boolean)
        )
      );

      formData.append(
        "requirements",
        JSON.stringify(
          data.requirements?.split(",").map((i) => i.trim()).filter(Boolean)
        )
      );

      formData.append(
        "targetAudience",
        JSON.stringify(
          data.targetAudience?.split(",").map((i) => i.trim()).filter(Boolean)
        )
      );

      formData.append(
        "tags",
        JSON.stringify(
          data.tags?.split(",").map((i) => i.trim()).filter(Boolean)
        )
      );

      formData.append("hasCertificate", String(data.hasCertificate));

      const thumbnail = data.thumbnail;
      if (!isEditMode && !thumbnail) {
        toast.error("Thumbnail is required");
        return;
      }

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      let res;

      if (isEditMode) {
        res = await updateCourse({ id: initialData.id, data: formData }).unwrap();
        toast.success("Course updated successfully!");
      } else {
        res = await createCourse(formData).unwrap();
        toast.success("Course created successfully!");
        localStorage.removeItem("courseDraft");
        if (onCreated) {
          onCreated(res?.data?.id);
        }
        reset();
        setThumbPreview(null);
        onClose?.();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                Course Title
              </label>

              <button
                type="button"
                disabled={isGenerating}
                onClick={async () => {
                  const title = watch("title");
                  const desc = watch("description");
                  if (!title && !desc) {
                    toast.error("Enter a title or description first.");
                    return;
                  }
                  try {
                    const res = await generateCourseContent({
                      topic: `${title?.trim() ?? ""} ${desc?.trim() ?? ""}`.trim(),
                    }).unwrap();
                    const ai = res?.data?.data;
                    if (!ai) {
                      toast.error("AI returned no data.");
                      return;
                    }
                    setValue("title", ai.title ?? "", { shouldValidate: true });
                    setValue("description", ai.description ?? "", { shouldValidate: true });
                    const toCsv = (arr?: any) => {
                      if (Array.isArray(arr)) return arr.join(", ");
                      if (typeof arr === "string") return arr;
                      return "";
                    };
                    setValue("tags", toCsv(ai.tags));
                    setValue("learningOutcomes", toCsv(ai.learningOutcomes));
                    setValue("requirements", toCsv(ai.requirements));
                    setValue("targetAudience", toCsv(ai.targetAudience));
                    toast.success("AI generated content has been applied!");
                  } catch (e) {
                    console.error(e);
                    toast.error("Failed to generate AI content.");
                  }
                }}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:opacity-80 active:scale-95 transition-all disabled:opacity-50"
              >
                <Sparkles size={14} className={isGenerating ? "animate-pulse" : ""} />
                {isGenerating ? "Generating…" : "Auto‑Generate with AI"}
              </button>
            </div>

            <input
              {...register("title", { required: true })}
              placeholder="Ex. Advanced Next.js Patterns"
              className="w-full h-14 px-6 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              placeholder="Describe what students will learn..."
              rows={4}
              className="w-full px-6 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:opacity-50 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Learning Outcomes (comma separated)
            </label>
            <input
              {...register("learningOutcomes")}
              placeholder="Ex: Build apps, Deploy projects"
              className="w-full h-14 px-6 bg-background border border-border rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Requirements
            </label>
            <input
              {...register("requirements")}
              placeholder="Ex: Basic JS, React knowledge"
              className="w-full h-14 px-6 bg-background border border-border rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Target Audience
            </label>
            <input
              {...register("targetAudience")}
              placeholder="Ex: Beginners, Developers"
              className="w-full h-14 px-6 bg-background border border-border rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Tags (comma separated)
            </label>
            <input
              {...register("tags")}
              placeholder="Ex: react, nextjs, backend"
              className="w-full h-14 px-6 bg-background border border-border rounded-2xl"
            />
          </div>

          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("hasCertificate")} />
              Has Certificate
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                Price (USD)
              </label>
              <input
                type="number"
                className={`w-full h-14 px-6 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:opacity-50`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                Category
              </label>
              <select
                {...register("categoryId", { required: true })}
                className="w-full h-14 px-6 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm cursor-pointer"
              >
                <option value="" className="bg-background text-foreground">
                  Select a category
                </option>
                {catLoading && <option className="bg-background text-foreground">Loading...</option>}
                {isError && <option className="bg-background text-foreground">Error loading</option>}
                {(categories?.data?.categories || categories?.data || [])?.map((cat: any) => (
                  <option key={cat.id} value={cat.id} className="bg-background text-foreground">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Preview Video URL
            </label>
            <input
              {...register("previewVideo", { required: true })}
              placeholder="YouTube URL"
              className="w-full h-14 px-6 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:opacity-50"
            />
          </div>

          {previewVideoUrl && (
            <div className="rounded-2xl overflow-hidden border border-border/50 relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={convertToEmbedUrl(previewVideoUrl)}
              ></iframe>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              Course Thumbnail
            </label>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbChange}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer bg-background border border-border rounded-2xl h-14 flex items-center pr-2"
                />
              </div>
              {thumbPreview && (
                <div className="w-32 h-20 rounded-xl overflow-hidden border border-border/50 flex-shrink-0">
                  <img src={thumbPreview} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all mt-8"
        >
          {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Course" : "Create Course")}
        </button>
      </form>
    </div>
  );
}
