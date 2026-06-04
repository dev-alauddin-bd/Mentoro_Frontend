"use client"
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  useGetAllLessonsQuery,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useGetAllModulesQuery
} from "@/redux/features/module/moduleApi";

import DashboardHeader from "@/components/common/DashboardHeader";
import DashboardCard from "@/components/common/DashboardCard";
import DashboardFilterBar from "@/components/common/DashboardFilterBar";
import DataTable, { Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import { useAddLessonMutation } from "@/redux/features/lesson/lessonApi";
import { Edit, Loader2, PlayCircle, Plus, Trash2, X } from "lucide-react";

export default function LessonsPage() {
  const { data: lessonsData, isLoading: queriesLoading } = useGetAllLessonsQuery();
  const { data: modulesData } = useGetAllModulesQuery();

  const lessons = lessonsData?.data?.lessons || lessonsData?.data || [];
  const modules = modulesData?.data?.modules || modulesData?.data || [];

  const [addLesson] = useAddLessonMutation();
  const [updateLesson] = useUpdateLessonMutation();
  const [deleteLesson] = useDeleteLessonMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    duration: 0,
    moduleId: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");

  // filter
  const filteredLessons = useMemo(() => {
    return lessons.filter((les: any) => {
      const matchesSearch = les.title.toLowerCase().includes(search.toLowerCase());
      const matchesModule = moduleFilter ? les.moduleId === moduleFilter : true;
      return matchesSearch && matchesModule;
    });
  }, [lessons, search, moduleFilter]);

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);

  const paginatedLessons = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredLessons.slice(start, start + itemsPerPage);
  }, [filteredLessons, page]);

  // modal open
  const openModal = (lesson?: any) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        title: lesson.title,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
        moduleId: lesson.moduleId
      });
    } else {
      setEditingLesson(null);
      setFormData({ title: "", videoUrl: "", duration: 0, moduleId: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
  };

  // submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingLesson) {
        await updateLesson({
          lessonId: editingLesson.id,
          data: { ...formData, duration: Number(formData.duration) }
        }).unwrap();

        toast.success("Lesson updated successfully!");
      } else {
        await addLesson({
          ...formData,
          duration: Number(formData.duration)
        }).unwrap();

        toast.success("Lesson created successfully!");
      }

      closeModal();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to save lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  // delete
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      try {
        await deleteLesson(id).unwrap();
        toast.success("Lesson deleted successfully!");
      } catch (err: any) {
        toast.error(err.data?.message || "Failed to delete lesson");
      }
    }
  };

  // columns
  const columns: Column<any>[] = [
    {
      header: "Lesson Title",
      accessor: (les) => (
        <p className="font-bold text-sm text-foreground line-clamp-1">
          {les.title}
        </p>
      )
    },
    {
      header: "Module",
      accessor: (les) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground">
            {les.module?.title || "N/A"}
          </span>
          <span className="text-[10px] uppercase text-muted-foreground">
            {les.module?.course?.title || ""}
          </span>
        </div>
      )
    },
    {
      header: "Duration",
      align: "center",
      accessor: (les) => (
        <div className="px-3 py-1 bg-secondary rounded-full text-xs font-bold">
          {les.duration}m
        </div>
      )
    },
    {
      header: "Actions",
      align: "right",
      accessor: (les) => (
        <div className="flex items-center justify-end gap-3">
          
          <button
            onClick={() => openModal(les)}
            className="cursor-pointer h-9 px-4 bg-background border rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>

          <button
            onClick={() => handleDelete(les.id)}
            className="cursor-pointer h-9 w-9 bg-background border rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10 max-w-7xl">

      <DashboardHeader
        badgeIcon={<PlayCircle className="w-3.5 h-3.5" />}
        badgeText="Course Content"
        title="Manage Lessons."
        subtitle="Upload videos, set durations, and build modules."
        action={
          <button
            onClick={() => openModal()}
            className="cursor-pointer h-14 px-8 bg-primary text-white rounded-2xl font-black"
          >
            <Plus className="w-4 h-4" /> Create Lesson
          </button>
        }
      />

      <DashboardFilterBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search lessons..."
        filterValue={moduleFilter}
        onFilterChange={(val) => {
          setModuleFilter(val);
          setPage(1);
        }}
        filterPlaceholder="All Modules"
        filterOptions={modules.map((m: any) => ({
          value: m.id,
          label: m.title
        }))}
      />

      <DashboardCard
        footer={
          totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )
        }
      >
        <DataTable
          columns={columns}
          data={paginatedLessons}
          isLoading={queriesLoading}
          loadingMessage="Loading Lessons..."
          emptyState={{
            title: "No Lessons Found",
            description: "Start adding content",
            icon: <PlayCircle className="w-12 h-12" />
          }}
        />
      </DashboardCard>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

          <div className="bg-card w-full max-w-lg p-8 rounded-3xl relative">

            <button
              onClick={closeModal}
              className="cursor-pointer absolute right-6 top-6"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-6">
              {editingLesson ? "Edit Lesson" : "Create Lesson"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                className="w-full h-12 px-4 border rounded-xl"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <input
                className="w-full h-12 px-4 border rounded-xl"
                placeholder="Video URL"
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
              />

              <input
                type="number"
                className="w-full h-12 px-4 border rounded-xl"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: Number(e.target.value)
                  })
                }
              />

              <select
                className="w-full h-12 px-4 border rounded-xl cursor-pointer"
                value={formData.moduleId}
                onChange={(e) =>
                  setFormData({ ...formData, moduleId: e.target.value })
                }
              >
                <option value="">Select Module</option>
                {modules.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>

              <button
                disabled={isSubmitting}
                className="cursor-pointer w-full h-12 bg-primary text-white rounded-xl font-bold"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : editingLesson ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}