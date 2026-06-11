"use client";

import { useState, useEffect } from "react";
import CourseCreateForm from "@/components/course-form/CourseCreateForm";
import CourseList from "@/components/course-form/CourseList";
import Pagination from "@/components/common/Pagination";
import DashboardHeader from "@/components/common/DashboardHeader";
import DashboardFilterBar from "@/components/common/DashboardFilterBar";
import DashboardCard from "@/components/common/DashboardCard";

import {
  useDeleteCourseMutation,
  useGetInstructorCoursesQuery,
  useTogglePublishMutation,
} from "@/redux/features/course/courseAPi";

import { useGetCategoriesQuery } from "@/redux/features/category/categoriesApi";

import { Plus, BookOpen, Search, X } from "lucide-react";
import toast from "react-hot-toast";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Icourse } from "@/interfaces/course.interface";

export default function ManageCourses() {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.mentoroAuth);
  const router = useRouter();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Icourse | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const limit = 6;

  const {
    data: coursesData,
    refetch,
    isLoading,
  } = useGetInstructorCoursesQuery(
    {
      page,
      limit,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(category ? { category } : {}),
    },
    { skip: !user?.id }
  );

  const courses = coursesData?.data || [];
  const meta = coursesData?.meta;
  const totalPages = meta?.totalPages || 1;

  const [deleteCourse] = useDeleteCourseMutation();
  const [togglePublish] = useTogglePublishMutation();

  const { data: categories } = useGetCategoriesQuery();

  // ================= ESC CLOSE =================
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCreateModal(false);
        setCourseToEdit(null);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // ================= BODY SCROLL LOCK =================
  useEffect(() => {
    document.body.style.overflow = showCreateModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCreateModal]);

  // ================= CONFIRM TOAST =================
  const confirmAction = (message: string, onConfirm: () => void) => {
    toast.custom((t_toast) => (
      <div
        className={`${t_toast.visible ? "animate-enter" : "animate-leave"
          } max-w-sm w-full bg-card border border-border shadow-2xl rounded-2xl p-4`}
      >
        <p className="text-sm font-bold text-center">{message}</p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => toast.dismiss(t_toast.id)}
            className="flex-1 bg-secondary cursor-pointer text-xs font-black uppercase py-2 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              toast.dismiss(t_toast.id);
              onConfirm();
            }}
            className="flex-1 bg-primary cursor-pointer text-white text-xs font-black uppercase py-2 rounded-xl"
          >
            Confirm
          </button>
        </div>
      </div>
    ));
  };

  // ================= DELETE =================
  const handleDelete = (id: string) => {
    confirmAction("Delete this course?", async () => {
      await deleteCourse(id).unwrap();
      toast.success("Deleted successfully");
      refetch();
    });
  };

  // ================= TOGGLE PUBLISH =================
  const handleTogglePublish = (
    id: string,
    currentStatus: boolean,
    title: string
  ) => {
    const action = currentStatus ? "Unpublish" : "Publish";

    confirmAction(`Are you sure to ${action} "${title}"?`, async () => {
      await toast.promise(togglePublish(id).unwrap(), {
        loading: `${action}ing...`,
        success: `${action}ed successfully`,
        error: `Failed to ${action}`,
      });

      refetch();
    });
  };

  // ================= EDIT =================
  const handleEdit = (course: any) => {
    setCourseToEdit(course);
    setShowCreateModal(true);
  };

  // ================= ADD MODULE =================
  const handleAddModule = (course: any) => {
    router.push(
      `/dashboard/instructor/modules?courseId=${course.id}&courseTitle=${encodeURIComponent(
        course.title
      )}&openModal=true`
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10  animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <DashboardHeader
        badgeIcon={<BookOpen className="w-3.5 h-3.5" />}
        badgeText={t("instructor.manage_courses.catalog")}
        title={t("instructor.manage_courses.title")}
        subtitle="Organize, build, and publish premium courses for your students."
        action={
          <button
            onClick={() => setShowCreateModal(true)}
            className="h-14 px-8 bg-primary text-white cursor-pointer rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Course
          </button>
        }
      />

      <DashboardFilterBar
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder="Search courses..."
        filterValue={category}
        onFilterChange={(val) => { setCategory(val); setPage(1); }}
        filterPlaceholder="All Categories"
        filterOptions={(categories?.data ?? []).map((c: any) => ({ value: `${c.id}`, label: c.name }))}
      />

      <DashboardCard
        header={
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black italic">Course Catalog.</h3>
              <p className="text-sm font-medium text-muted-foreground">Monitor and organize your online courses.</p>
            </div>
          </div>
        }
        footer={
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        }
      >
        <CourseList
          courses={courses}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
          onAddModule={handleAddModule}
        />
      </DashboardCard>

      {/* MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setShowCreateModal(false);
              setCourseToEdit(null);
            }}
          />

          {/* modal */}
          <div className="relative w-full max-w-3xl mx-4 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden z-[10000]">

            {/* HEADER (always on top) */}
            <div className="relative z-[10001] flex justify-end p-3 bg-card border-b border-border">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCourseToEdit(null);
                }}
                className="w-9 h-9 flex items-center cu cursor-pointer justify-center rounded-full bg-background border border-border hover:bg-red-500 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* scroll area */}
            <div className="max-h-[90vh] overflow-y-auto p-6 relative z-[9999]">
              <CourseCreateForm
                initialData={courseToEdit}
                onClose={() => {
                  setShowCreateModal(false);
                  setCourseToEdit(null);
                }}
              />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}