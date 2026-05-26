"use client";

import { Edit2, BookOpen, Eye, Trash2, CloudUpload, CloudOff, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import DataTable, { Column } from "@/components/common/DataTable";

export default function CourseList({ courses, isLoading, onEdit, onAddModule, onDelete, onTogglePublish, }: any) {

  const courseData = (courses as any)?.data?.courses || [];

  const columns: Column<any>[] = [
    {
      header: "Course Identity",
      accessor: (course) => (
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-14 rounded-2xl overflow-hidden border border-border/50 flex-shrink-0 bg-muted shadow-sm group-hover:shadow-md transition-all">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground/30">
                <BookOpen className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5 min-w-0">
            <p className="font-black text-foreground text-base tracking-tight leading-none group-hover:text-primary transition-colors">{course.title}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md border border-border/30">
                {course.category?.name || "Uncategorized"}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${course.isPublished ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${course.isPublished ? "bg-green-500 animate-pulse" : "bg-orange-500"}`} />
                {course.isPublished ? "Published" : "Draft"}
              </span>

            </div>
          </div>
        </div>
      )
    },
    {
      header: "Instructor",
      accessor: (course) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black uppercase">
            {(course.instructor as any)?.name?.charAt(0) || "I"}
          </div>
          <p className="text-xs font-black text-muted-foreground">{(course.instructor as any)?.name || "Instructor"}</p>
        </div>
      )
    },
    {
      header: "Price",
      align: "right",
      accessor: (course) => (
        <div className="flex flex-col items-end">
          <p className="font-black text-lg text-foreground tracking-tighter">${course.price || 0}</p>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">USD Currency</p>
        </div>
      )
    },
    {
      header: "Enrolled",
      align: "center",
      accessor: (course) => (
        <div className="flex flex-col items-center gap-1">
          <div className="h-9 w-9 bg-primary/5 rounded-full flex items-center justify-center text-primary font-black text-xs border border-primary/10">
            {course.enrolledUsers?.length || course._count?.enrolledUsers || 0}
          </div>
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Students</p>
        </div>
      )
    },
    {
      header: "Actions",
      align: "right",
      accessor: (course) => (
        <div className="flex items-center justify-end gap-2.5">
          <div className="flex items-center bg-secondary/30 p-1.5 rounded-2xl border border-border/50 gap-1.5">
            <button
              onClick={() => onTogglePublish(course.id, course.isPublished, course.title)}
              className={`h-9 w-9 rounded-xl transition-all flex items-center justify-center shadow-sm ${course.isPublished ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-green-500 text-white hover:bg-green-600"}`}
              title={course.isPublished ? "Unpublish Course" : "Publish Course"}
            >
              {course.isPublished ? <CloudOff className="w-4 h-4" /> : <CloudUpload className="w-4 h-4" />}
            </button>


          </div>

          <div className="flex items-center bg-secondary/30 p-1.5 rounded-2xl border border-border/50 gap-1.5">
            <Link
              href={`/courses/${course.id}`}
              className="h-9 w-9 bg-background border border-border/50 rounded-xl text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center shadow-sm"
              title="View Public Page"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={() => onEdit(course)}
              className="h-9 w-9 bg-background border border-border/50 rounded-xl text-muted-foreground hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all flex items-center justify-center shadow-sm"
              title="Edit Course"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onAddModule(course)}
              className="h-9 w-9 bg-background border border-border/50 rounded-xl text-muted-foreground hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all flex items-center justify-center shadow-sm"
              title="Add Module"
            >
              <Layers className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(course.id)}
              className="h-9 w-9 bg-background border border-border/50 rounded-xl text-muted-foreground hover:bg-destructive hover:text-white hover:border-destructive transition-all flex items-center justify-center shadow-sm"
              title="Delete Course"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={courseData}
      isLoading={isLoading}
      loadingMessage="Loading Catalog..."
      emptyState={{
        title: "No Courses Found.",
        description: "Start by creating your first course.",
        icon: <BookOpen className="w-12 h-12" />
      }}
    />
  );
}