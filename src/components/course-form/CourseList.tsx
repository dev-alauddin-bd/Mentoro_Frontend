"use client";

import {
  Edit2,
  BookOpen,
  Eye,
  Trash2,
  CloudUpload,
  CloudOff,
  Layers,
} from "lucide-react";
import Link from "next/link";
import DataTable, { Column } from "@/components/common/DataTable";

export default function CourseList({
  courses,
  isLoading,
  onEdit,
  onAddModule,
  onDelete,
  onTogglePublish,
}: any) {
  // ✅ FIX: already array, no nesting
  const courseData = courses || [];

  const columns: Column<any>[] = [
    {
      header: "Course Identity",
      accessor: (course) => (
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-14 rounded-2xl overflow-hidden border border-border/50 bg-muted">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <p className="font-black text-base">{course.title}</p>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-secondary">
                {course.category || "Uncategorized"}
              </span>

              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  course.isPublished
                    ? "bg-green-500/10 text-green-500"
                    : "bg-orange-500/10 text-orange-500"
                }`}
              >
                {course.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </div>
      ),
    },

    {
      header: "Instructor",
      accessor: (course) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            {course.instructor?.name?.charAt(0) || "I"}
          </div>
          <p className="text-xs font-black">
            {course.instructor?.name || "Instructor"}
          </p>
        </div>
      ),
    },

    {
      header: "Price",
      align: "right",
      accessor: (course) => (
        <div className="flex flex-col items-end">
          <p className="font-black text-lg">${course.price || 0}</p>
          <p className="text-[9px] uppercase">USD</p>
        </div>
      ),
    },

    {
      header: "Enrolled",
      align: "center",
      accessor: (course) => (
        <div className="flex flex-col items-center gap-1">
          <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center font-black text-xs">
            {course.enrollments || 0}
          </div>
          <p className="text-[9px] uppercase">Students</p>
        </div>
      ),
    },

    {
      header: "Actions",
      align: "right",
      accessor: (course) => (
        <div className="flex items-center gap-2">
          {/* Publish Toggle */}
          <button
            onClick={() =>
              onTogglePublish(course.id, course.isPublished, course.title)
            }
            className={`h-9 w-9 rounded-xl flex items-center justify-center ${
              course.isPublished
                ? "bg-orange-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {course.isPublished ? (
              <CloudOff className="w-4 h-4" />
            ) : (
              <CloudUpload className="w-4 h-4" />
            )}
          </button>

          {/* View */}
          <Link
            href={`/courses/${course.slug || course.id}`}
            target="_blank"
            className="h-9 w-9 flex items-center justify-center border rounded-xl"
          >
            <Eye className="w-4 h-4" />
          </Link>

          {/* Edit */}
          <button
            onClick={() => onEdit(course)}
            className="h-9 w-9 border rounded-xl flex items-center justify-center"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Module */}
          <button
            onClick={() => onAddModule(course)}
            className="h-9 w-9 border rounded-xl flex items-center justify-center"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(course.id)}
            className="h-9 w-9 border rounded-xl flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={courseData}
      isLoading={isLoading}
      loadingMessage="Loading Catalog..."
      emptyState={{
        title: "No Courses Found",
        description: "Start by creating your first course.",
        icon: <BookOpen className="w-12 h-12" />,
      }}
    />
  );
}