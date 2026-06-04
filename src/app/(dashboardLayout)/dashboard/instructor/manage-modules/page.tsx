"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  useGetAllModulesQuery,
  useAddModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation
} from "@/redux/features/module/moduleApi";

import DashboardHeader from "@/components/common/DashboardHeader";
import DashboardCard from "@/components/common/DashboardCard";
import DashboardFilterBar from "@/components/common/DashboardFilterBar";
import DataTable, { Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import { Edit, Trash2, Layers, Plus, X, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetInstructorCoursesQuery } from "@/redux/features/course/courseAPi";

export default function ModulesPage() {
  const { user } = useSelector((state: RootState) => state.mentoroAuth);

  const { data: modulesData, isLoading: queriesLoading } =
    useGetAllModulesQuery();

  const { data: coursesData } = useGetInstructorCoursesQuery(
    { limit: 8 },
    { skip: !user?.id }
  );

  const modules = modulesData?.data || [];
  const courses = coursesData?.data || [];

  const [addModule] = useAddModuleMutation();
  const [updateModule] = useUpdateModuleMutation();
  const [deleteModule] = useDeleteModuleMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);

  const [formData, setFormData] = useState({ title: "", courseId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  const itemsPerPage = 8;

  // 🔥 FILTER
  const filteredModules = useMemo(() => {
    return modules.filter((mod: any) => {
      const matchesSearch = mod.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCourse = courseFilter
        ? mod.courseId === courseFilter
        : true;

      return matchesSearch && matchesCourse;
    });
  }, [modules, search, courseFilter]);

  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);

  // 🔥 PAGINATION FIX
  const paginatedModules = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredModules.slice(start, start + itemsPerPage);
  }, [filteredModules, page]);

  useEffect(() => {
    const courseId = searchParams.get("courseId");
    const openModalParam = searchParams.get("openModal");

    if (openModalParam === "true" && courseId) {
      setFormData({ title: "", courseId });
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const openModal = (mod?: any) => {
    if (mod) {
      setEditingModule(mod);
      setFormData({
        title: mod.title,
        courseId: mod.courseId
      });
    } else {
      setEditingModule(null);
      setFormData({ title: "", courseId: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingModule(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingModule) {
        await updateModule({
          courseId: formData.courseId,
          moduleId: editingModule.id,
          data: { title: formData.title }
        }).unwrap();

        toast.success("Module updated successfully!");
      } else {
        await addModule(formData).unwrap();
        toast.success("Module created successfully!");
      }

      closeModal();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to save module");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteModule(id).unwrap();
        toast.success("Module deleted!");
      } catch (err: any) {
        toast.error(err.data?.message || "Failed to delete module");
      }
    }
  };

  // ✅ NO GROUP HOVER - ALWAYS VISIBLE ACTIONS
  const columns: Column<any>[] = [
    {
      header: "Module Title",
      accessor: (mod) => (
        <p className="font-bold text-sm">{mod.title}</p>
      )
    },
    {
      header: "Course",
      accessor: (mod) => (
        <p className="text-xs text-muted-foreground">
          {mod.course?.title || "N/A"}
        </p>
      )
    },
    {
      header: "Lessons",
      align: "center",
      accessor: (mod) => (
        <div className="px-3 py-1 bg-secondary rounded-full text-xs font-bold">
          {mod._count?.lessons || 0}
        </div>
      )
    },
    {
      header: "Actions",
      align: "right",
      accessor: (mod) => (
        <div className="flex items-center justify-end gap-2">

          <button
            onClick={() => openModal(mod)}
            className="h-9 px-4 bg-primary text-white cursor-pointer rounded-xl text-xs font-bold"
          >
            <Edit className="w-3 h-3 inline-block mr-1" />
            Edit
          </button>

          <button
            onClick={() => handleDelete(mod.id)}
            className="h-9 px-3 bg-red-500 text-white cursor-pointer   rounded-xl text-xs font-bold"
          >
            <Trash2 className="w-3 h-3" />
          </button>

        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10">

      <DashboardHeader
        badgeIcon={<Layers />}
        badgeText="Course Structure"
        title="Manage Modules"
        subtitle="Organize your curriculum"
        action={
          <button
            onClick={() => openModal()}
            className="h-14 px-8 bg-primary border border-primary cursor-pointer flex items-center gap-2 text-white rounded-2xl font-black"
          >
            <Plus className="w-4 h-4" /> Add Module
          </button>
        }
      />

      <DashboardFilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search modules..."
        filterValue={courseFilter}
        onFilterChange={(v) => { setCourseFilter(v); setPage(1); }}
        filterOptions={courses.map((c: any) => ({
          value: c.id,
          label: c.title
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
          data={paginatedModules}   // 🔥 FIXED (IMPORTANT)
          isLoading={queriesLoading}
          loadingMessage="Loading Modules..."
          emptyState={{
            title: "No Modules Found",
            description: "Create your first module",
            icon: <Layers className="w-10 h-10" />
          }}
        />
      </DashboardCard>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

          {/* Modal Card */}
          <div className="relative w-full max-w-xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
              <div>
                <h2 className="text-lg font-bold">
                  {editingModule ? "Edit Module" : "Create Module"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Manage your course structure easily
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="h-9 w-9 flex items-center cursor-pointer justify-center rounded-full hover:bg-muted transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Module Title */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  Module Title
                </label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Introduction to React"
                  className="w-full mt-1 h-12 px-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Course Select */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  Select Course
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) =>
                    setFormData({ ...formData, courseId: e.target.value })
                  }
                  className="w-full mt-1 h-12 px-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Choose a course</option>
                  {courses.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Preview Card */}
              {formData.courseId && (
                <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/40">
                  {(() => {
                    const selectedCourse = courses.find(
                      (c: any) => c.id === formData.courseId
                    );

                    return selectedCourse ? (
                      <>
                        <img
                          src={selectedCourse.thumbnail}
                          className="w-14 h-10 rounded-lg object-cover border"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold line-clamp-1">
                            {selectedCourse.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Selected Course
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No course selected
                      </p>
                    );
                  })()}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 h-11 cursor-pointer rounded-xl border hover:bg-muted transition"
                >
                  Cancel
                </button>

                <button
                  disabled={isSubmitting}
                  className="flex-1 h-11 cursor-pointer rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition"
                >
                  {isSubmitting ? "Saving..." : "Save Module"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}