"use client";

import { useState, useEffect } from "react";
import CourseCreateForm from "@/components/course-form/CourseCreateForm";
import CourseList from "@/components/course-form/CourseList";
import Pagination from "@/components/common/Pagination";

import {
  useDeleteCourseMutation,
  useGetInstructorCoursesQuery,
  useTogglePublishMutation,
} from "@/redux/features/course/courseAPi";

import { useGetCategoriesQuery } from "@/redux/features/category/categoriesApi";

import { Plus, BookOpen, Search, Filter, X } from "lucide-react";
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

  const limit = 5;

  // ✅ FIXED API RESPONSE
  const {
    data: coursesData,
    refetch,
    isLoading,
  } = useGetInstructorCoursesQuery(
    { page, limit, search, category },
    { skip: !user?.id }
  );

  const courses = coursesData?.data || [];
  const meta = coursesData?.meta;

  const totalPages = meta?.totalPages || 1;

  const [deleteCourse] = useDeleteCourseMutation();
  const [togglePublish] = useTogglePublishMutation();

  const { data: categories } = useGetCategoriesQuery();

  // body scroll lock
  useEffect(() => {
    document.body.style.overflow = showCreateModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCreateModal]);

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

  const handleDelete = (id: string) => {
    confirmAction("Delete this course?", async () => {
      await deleteCourse(id).unwrap();
      toast.success("Deleted successfully");
      refetch();
    });
  };

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

  const handleEdit = (course: any) => {
    setCourseToEdit(course);
    setShowCreateModal(true);
  };

  const handleAddModule = (course: any) => {
    router.push(
      `/dashboard/instructor/modules?courseId=${course.id}&courseTitle=${encodeURIComponent(
        course.title
      )}&openModal=true`
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10 container">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase">
            <BookOpen className="w-4 h-4" />
            {t("instructor.manage_courses.catalog")}
          </div>

          <h1 className="text-4xl font-black">
            {t("instructor.manage_courses.title")}
          </h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="h-12 px-6 bg-primary text-white cursor-pointer rounded-2xl font-black"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Add Course
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 bg-card p-4 rounded-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search..."
            className="w-full pl-10 h-10"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X className="w-4 h-4 cursor-pointer" />
            </button>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All</option>
          {(categories?.data?.categories || []).map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* LIST */}
      <CourseList
        courses={courses}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        onAddModule={handleAddModule}
      />

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowCreateModal(false)}
          />

          {/* modal box */}
          <div className="relative w-full max-w-3xl mx-4 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">

            {/* scroll container */}
            <div className="max-h-[90vh] overflow-y-auto p-6">
              <CourseCreateForm
                initialData={courseToEdit}
                onClose={() => setShowCreateModal(false)} 
              
              />
            </div>

          </div>
        </div>
      )}
    </div>
  );
}