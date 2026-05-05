"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useCreateCourseMutation, useUpdateCourseMutation } from "@/redux/features/course/courseAPi";
import { useGetCategoriesQuery } from "@/redux/features/category/categoriesApi";
import { ICourse } from "@/interfaces/course.interface";
import toast from "react-hot-toast";
import { useEffect } from "react";

type FormValues = {
  title: string;
  description: string;
  thumbnailFile?: File;
  previewVideo: string;
  price: number;
  categoryId: string;
};

// Convert YouTube URL → embed URL
const convertToEmbedUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("youtu.be/"))
    return url.replace("https://youtu.be/", "https://www.youtube.com/embed/");
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

export default function CourseCreateForm({
  onCreated,
  initialData,
}: {
  onCreated?: (courseId: string) => void;
  initialData?: any;
}) {
  const isEditMode = !!initialData;
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        title: initialData?.title || "",
        description: initialData?.description || "",
        previewVideo: initialData?.previewVideo || "",
        price: initialData?.price || 0,
        categoryId: initialData?.categoryId || "",
      },
    });

  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const { data: categories, isLoading: catLoading, isError } =
    useGetCategoriesQuery();

  const [thumbPreview, setThumbPreview] = useState<string | null>(initialData?.thumbnail || null);
  const [loading, setLoading] = useState(false);

  // Pre-fill form if initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        previewVideo: initialData.previewVideo,
        price: initialData.price,
        categoryId: initialData.categoryId,
      });
      setThumbPreview(initialData.thumbnail);
    }
  }, [initialData, reset]);

  // Thumbnail handler
  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("thumbnailFile" as any, file);

    const reader = new FileReader();
    reader.onload = () => setThumbPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormValues) => {
    if (!isEditMode && !data.thumbnailFile) {
      toast.error("Thumbnail is required for new courses!");
      return;
    }

    if (!data.categoryId) {
      toast.error("Category is required!");
      return;
    }

    try {
      setLoading(true);

      let thumbnailUrl = initialData?.thumbnail || "";
      
      // Upload to Cloudinary only if a new file is selected
      if (data.thumbnailFile) {
        const fd = new FormData();
        fd.append("file", data.thumbnailFile);
        fd.append("upload_preset", "course_thumbnails");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dyfamn6rm/image/upload",
          {
            method: "POST",
            body: fd,
          }
        );

        const json = await res.json();
        thumbnailUrl = json.secure_url;

        if (!thumbnailUrl) {
          toast.error("Thumbnail upload failed!");
          return;
        }
      }

      // Convert video URL
      const embedVideoUrl = convertToEmbedUrl(data.previewVideo);

      // ✅ Correct payload
      const payload: any = {
        title: data.title,
        description: data.description,
        thumbnail: thumbnailUrl,
        previewVideo: embedVideoUrl,
        price: Number(data.price),
        categoryId: data.categoryId,
      };

      if (isEditMode) {
        await updateCourse({ id: initialData.id, data: payload }).unwrap();
        toast.success("✅ Course updated successfully!");
      } else {
        const created = await createCourse(payload).unwrap();
        toast.success("✅ Course created successfully!");
        
        const createdCourseId =
          (created as any)?.id ??
          (created as any)?._id ??
          (created as any)?.data?.id ??
          (created as any)?.data?._id;

        if (onCreated && createdCourseId) {
          onCreated(createdCourseId);
        }
      }

      if (!isEditMode) {
        reset();
        setThumbPreview(null);
      } else if (onCreated) {
        onCreated(initialData.id);
      }
      
    } catch (err) {
      console.error("❌ Form submission error:", err);
      toast.error(isEditMode ? "Failed to update course." : "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  const previewVideoUrl = watch("previewVideo");

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Course Title</label>
                <input
                {...register("title", { required: true })}
                placeholder="Ex. Advanced Next.js Patterns"
                className="w-full h-14 px-6 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:opacity-50"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                <textarea
                {...register("description", { required: true })}
                placeholder="Describe what students will learn..."
                rows={4}
                className="w-full px-6 py-4 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:opacity-50 resize-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Price (USD)</label>
                <input
                    type="number"
                    {...register("price", { required: true, valueAsNumber: true })}
                    placeholder="299"
                    className="w-full h-14 px-6 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:opacity-50"
                />
                </div>

                <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                <select
                    {...register("categoryId", { required: true })}
                    className="w-full h-14 px-6 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm cursor-pointer"
                >
                    <option value="">Select a category</option>
                    {catLoading && <option>Loading...</option>}
                    {isError && <option>Error loading</option>}
                    {(categories?.data?.categories || categories?.data || [])?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                    ))}
                </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Preview Video URL</label>
                <input
                {...register("previewVideo", { required: true })}
                placeholder="YouTube URL"
                className="w-full h-14 px-6 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:opacity-50"
                />
            </div>

            {/* Video Preview */}
            {previewVideoUrl && (
            <div className="rounded-2xl overflow-hidden border border-border/50 relative pt-[56.25%]">
                <iframe
                className="absolute inset-0 w-full h-full"
                src={convertToEmbedUrl(previewVideoUrl)}
                ></iframe>
            </div>
            )}

            {/* Thumbnail */}
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Course Thumbnail</label>
                <div className="flex items-center gap-6">
                    <div className="flex-1">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleThumbChange} 
                            className="w-full text-sm text-muted-foreground file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer bg-secondary/30 rounded-2xl h-14 flex items-center pr-2"
                        />
                    </div>
                    {thumbPreview && (
                        <div className="w-32 h-20 rounded-xl overflow-hidden border border-border/50 flex-shrink-0">
                            <img
                                src={thumbPreview}
                                className="w-full h-full object-cover"
                            />
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