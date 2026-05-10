"use client";

import { useState } from "react";
import CourseCreateForm from "@/components/course-form/CourseCreateForm";
import { useGetAllCoursesQuery, useDeleteCourseMutation, useTogglePublishMutation, useCreateFeaturedCheckoutMutation } from "@/redux/features/course/courseAPi";
import CourseList from "@/components/course-form/CourseList";
import { ICourse } from "@/interfaces/course.interface";
import { Plus, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function ManageCourses() {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.cmAuth);
  const router = useRouter();
  const { data: courses, refetch, isLoading } = useGetAllCoursesQuery(
    { instructorId: user?.id },
    { skip: !user?.id }
  );
  const [deleteCourse] = useDeleteCourseMutation();
  const [togglePublish] = useTogglePublishMutation();
  const [createFeaturedCheckout] = useCreateFeaturedCheckoutMutation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<ICourse | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm(t("instructor.manage_courses.delete_confirm"))) {
      try {
        await deleteCourse(id).unwrap();
        toast.success(t("instructor.manage_courses.delete_success"));
        refetch();
      } catch (err) {
        toast.error(t("instructor.manage_courses.delete_error"));
      }
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean, title: string) => {
    const action = currentStatus ? "Unpublish" : "Publish";
    const confirmed = window.confirm(`Are you sure you want to ${action.toLowerCase()} "${title}"?`);
    
    if (!confirmed) return;

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
  };

  const handleEdit = (course: any) => {
    setCourseToEdit(course);
    setShowCreateModal(true);
  };

  const handleAddModule = (course: any) => {
    // Navigate to modules page with course info
    router.push(`/dashboard/instructor/modules?courseId=${course.id}&courseTitle=${encodeURIComponent(course.title)}&openModal=true`);
  };

  const handleFeatureRequest = async (id: string, title: string) => {
    const confirmed = window.confirm(t("instructor.manage_courses.promote_confirm", { title }));
    if (!confirmed) return;

    try {
      const response = await toast.promise(
        createFeaturedCheckout(id).unwrap(),
        {
          loading: "Preparing payment session...",
          success: "Redirecting to secure payment...",
          error: (err) => err?.data?.message || "Failed to initiate payment",
        }
      );

      if (response?.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
    } catch (err) {}
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

      <div className="bg-card border border-border/60 rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden">
        {/* Course List */}
        <CourseList
          courses={courses}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={(id: string) => handleDelete(id)}
          onTogglePublish={handleTogglePublish}
          onAddModule={handleAddModule}
          onFeatureRequest={handleFeatureRequest}
        />
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            
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