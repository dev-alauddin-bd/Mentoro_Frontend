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
import { useGetInstructorAllCoursesQuery } from "@/redux/features/course/courseAPi";

export default function ModulesPage() {
  const { user } = useSelector((state: RootState) => state.mentoroAuth);
  const { data: modulesData, isLoading: queriesLoading } = useGetAllModulesQuery();
  const { data: coursesData } = useGetInstructorAllCoursesQuery(
    { limit: 100 },
    { skip: !user?.id }
  );
  const modules = modulesData?.data || [];
  const courses = coursesData?.data?.courses || [];

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

  const filteredModules = useMemo(() => {
    return modules.filter((mod: any) => {
        const matchesSearch = mod.title.toLowerCase().includes(search.toLowerCase());
        const matchesCourse = courseFilter ? mod.courseId === courseFilter : true;
        return matchesSearch && matchesCourse;
    });
  }, [modules, search, courseFilter]);

  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);
  const paginatedModules = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredModules.slice(start, start + itemsPerPage);
  }, [filteredModules, page]);

  // Handle auto-modal from query params
  useEffect(() => {
    const courseId = searchParams.get("courseId");
    const openModalParam = searchParams.get("openModal");

    if (openModalParam === "true" && courseId) {
      setFormData({ title: "", courseId: courseId });
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
        await updateModule({ courseId: formData.courseId, moduleId: editingModule.id, data: { title: formData.title } }).unwrap();
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
    if (confirm("Are you sure you want to delete this module? All lessons inside will be lost!")) {
      try {
        await deleteModule(id).unwrap();
        toast.success("Module deleted successfully!");
      } catch (err: any) {
        toast.error(err.data?.message || "Failed to delete module");
      }
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Module Title",
      accessor: (mod) => <p className="font-bold text-foreground text-sm line-clamp-1">{mod.title}</p>
    },
    {
      header: "Course",
      accessor: (mod) => <p className="text-xs font-bold text-muted-foreground">{mod.course?.title || "N/A"}</p>
    },
    {
      header: "Lessons",
      align: "center",
      accessor: (mod) => (
        <div className="inline-flex items-center justify-center px-3 py-1 bg-secondary rounded-full text-xs font-bold text-muted-foreground">
          {mod._count?.lessons || 0}
        </div>
      )
    },
    {
      header: "Actions",
      align: "right",
      accessor: (mod) => (
        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => openModal(mod)}
            className="h-9 px-4 bg-background border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2 shadow-sm"
          >
            <Edit className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => handleDelete(mod.id)}
            className="h-9 w-9 bg-background border border-border/50 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
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
        badgeIcon={<Layers className="w-3.5 h-3.5" />}
        badgeText="Course Structure"
        title="Manage Modules."
        subtitle="Organize your curriculum into manageable sections to guide your students through their learning journey."
        action={
          <button
            onClick={() => openModal()}
            className="h-14 px-8 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Module
          </button>
        }
      />

      <DashboardFilterBar 
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder="Search modules..."
        filterValue={courseFilter}
        onFilterChange={(val) => { setCourseFilter(val); setPage(1); }}
        filterPlaceholder="All Courses"
        filterOptions={courses.map((c: any) => ({ value: c.id, label: c.title }))}
      />

      <DashboardCard
        footer={
            totalPages > 1 && (
                <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            )
        }
      >
        <DataTable
          columns={columns}
          data={paginatedModules}
          isLoading={queriesLoading}
          loadingMessage="Loading Modules..."
          emptyState={{
            title: "No Modules Found.",
            description: "Start structuring your courses by adding modules.",
            icon: <Layers className="w-12 h-12" />
          }}
        />
      </DashboardCard>

      {/* Modern Dialog Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border/60 w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={closeModal} className="absolute right-8 top-8 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-8">
              <h2 className="text-2xl font-black tracking-tight italic">{editingModule ? "Edit Module" : "Create New Module"}</h2>
              <p className="text-sm text-muted-foreground font-medium">Configure your module details below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Module Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Introduction to React"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-14 px-6 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Assigned Course</label>
                <select
                  required
                  disabled={!!editingModule}
                  value={formData.courseId}
                  onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full h-14 px-6 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm cursor-pointer disabled:opacity-50"
                >
                  <option value="" disabled>Select a course...</option>
                  {courses.map((course: any) => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div className="pt-6 flex justify-end gap-3 flex-col sm:flex-row">
                <button type="button" onClick={closeModal} className="h-14 px-8 bg-secondary/50 hover:bg-secondary rounded-2xl text-xs font-black uppercase tracking-widest text-foreground transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="h-14 px-8 bg-primary rounded-2xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-primary/20">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingModule ? "Save Changes" : "Create Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
