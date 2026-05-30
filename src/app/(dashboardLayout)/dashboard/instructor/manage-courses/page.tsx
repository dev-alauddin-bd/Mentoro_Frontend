"use client";

import { useState, useEffect } from "react";
import CourseCreateForm from "@/components/course-form/CourseCreateForm";
import { useDeleteCourseMutation, useTogglePublishMutation,  useGetInstructorAllCoursesQuery } from "@/redux/features/course/courseAPi";
import CourseList from "@/components/course-form/CourseList";
import { ICourse } from "@/interfaces/course.interface";
import { Plus, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useGetCategoriesQuery } from "@/redux/features/category/categoriesApi";
import Pagination from "@/components/common/Pagination";
import { Search, Filter, X } from "lucide-react";


export default function ManageCourses() {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.mentoroAuth);
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<ICourse | null>(null);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (showCreateModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; }
  }, [showCreateModal]);

  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const limit = 5;

  const { data: courses, refetch, isLoading } = useGetInstructorAllCoursesQuery(
    {
      page,
      limit,
      search,
      category
    },
    { skip: !user?.id }
  );

  const [deleteCourse] = useDeleteCourseMutation();
  const [togglePublish] = useTogglePublishMutation();

  const { data: categories } = useGetCategoriesQuery();



  const confirmAction = (message: string, onConfirm: () => void) => {
    toast.custom((t_toast) => (
      <div className={`${t_toast.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-card border border-border shadow-2xl rounded-2xl pointer-events-auto flex flex-col p-4 gap-4`}>
        <p className="text-sm font-bold text-foreground text-center">
          {message}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => toast.dismiss(t_toast.id)}
            className="flex-1 bg-secondary text-foreground text-xs font-black uppercase tracking-widest py-2.5 rounded-xl hover:bg-secondary/80 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t_toast.id);
              onConfirm();
            }}
            className="flex-1 bg-primary text-white text-xs font-black uppercase tracking-widest py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleDelete = (id: string) => {
    confirmAction(t("instructor.manage_courses.delete_confirm"), async () => {
      try {
        await deleteCourse(id).unwrap();
        toast.success(t("instructor.manage_courses.delete_success"));
        refetch();
      } catch (err) {
        toast.error(t("instructor.manage_courses.delete_error"));
      }
    });
  };

  const handleTogglePublish = (id: string, currentStatus: boolean, title: string) => {
    const action = currentStatus ? "Unpublish" : "Publish";
    confirmAction(`Are you sure you want to ${action.toLowerCase()} "${title}"?`, async () => {
      try {
        await toast.promise(
          togglePublish(id).unwrap(),
          {
            loading: `${action}ing course...`,
            success: `Course ${action.toLowerCase()}ed successfully!`,
            error: (err) => err?.data?.message || `Failed to ${action.toLowerCase()} course`,
          }
        );
        refetch();
      } catch (err) {
        // Error handled by toast.promise
      }
    });
  };

  const courseData = (courses as any)?.data || [];

  const handleEdit = (course: any) => {
    setCourseToEdit(course);
    setShowCreateModal(true);
  };

  const handleAddModule = (course: any) => {
    // Navigate to modules page with course info
    router.push(`/dashboard/instructor/modules?courseId=${course.id}&courseTitle=${encodeURIComponent(course.title)}&openModal=true`);
  };



  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10 max-w-7xl">

      {/* Header Branding */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <BookOpen className="w-3.5 h-3.5" /> {t("instructor.manage_courses.catalog")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-tight italic">
            {t("instructor.manage_courses.title")}
          </h1>
          <p className="text-muted-foreground font-medium max-w-xl">
            {t("instructor.manage_courses.subtitle")}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="h-14 px-8 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> {t("instructor.manage_courses.create_course")}
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card border border-border/60 p-4 rounded-3xl shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search your courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-12 pl-11 pr-4 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm placeholder:font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative w-full md:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full h-12 pl-11 pr-4 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm cursor-pointer appearance-none"
          >
            <option value="">All Categories</option>
            {(categories?.data?.categories || [])?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden">

        {/* Course List */}
        <CourseList
          courses={courses}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={(id: string) => handleDelete(id)}
          onTogglePublish={handleTogglePublish}
          onAddModule={handleAddModule}
        />

        {/* Pagination Controls */}
        {((courses as any)?.data?.totalPages || 0) > 1 && (
          <div className="border-t border-border/50 bg-muted/5">
            <Pagination
              currentPage={page}
              totalPages={(courses as any)?.data?.totalPages || 0}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}



      </div>


      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-background/90" onClick={() => setShowCreateModal(false)}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-8 border-b border-border/50 pb-4">
              <div>
                <h3 className="text-2xl font-black italic tracking-tight">
                  {courseToEdit ? t("instructor.manage_courses.edit_course") : t("instructor.manage_courses.draft_new")}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                  {courseToEdit ? t("instructor.manage_courses.update_details") : t("instructor.manage_courses.fill_details")}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCourseToEdit(null);
                }}
                className="h-10 px-4 bg-secondary text-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted transition-colors"
              >
                {t("instructor.manage_courses.close")}
              </button>
            </div>

            {/* Form */}
            <CourseCreateForm
              initialData={courseToEdit}
              onCreated={() => {
                setShowCreateModal(false);

                setCourseToEdit(null);
                refetch();
              }}
            />

          </div>
        </div>
      )}
    </div>
  );
}