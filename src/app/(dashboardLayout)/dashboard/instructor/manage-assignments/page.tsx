"use client"
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  useGetAllAssignmentsQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetAllModulesQuery
} from "@/redux/features/module/moduleApi";
import DashboardHeader from "@/components/common/DashboardHeader";
import DashboardCard from "@/components/common/DashboardCard";
import DashboardFilterBar from "@/components/common/DashboardFilterBar";
import DataTable, { Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import { Edit2, FileText, Loader2, Plus, Trash2, X } from "lucide-react";

export default function AssignmentsPage() {
  const { data: assignmentsData, isLoading: queriesLoading } = useGetAllAssignmentsQuery();
  const { data: modulesData } = useGetAllModulesQuery();
  const assignments = assignmentsData?.data?.assignments || assignmentsData?.data || [];
  const modules = modulesData?.data?.modules || modulesData?.data || [];

  const [createAssignment] = useCreateAssignmentMutation();
  const [updateAssignment] = useUpdateAssignmentMutation();
  const [deleteAssignment] = useDeleteAssignmentMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [formData, setFormData] = useState({ description: "", moduleId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment: any) => {
        const matchesSearch = assignment.description.toLowerCase().includes(search.toLowerCase());
        const matchesModule = moduleFilter ? assignment.moduleId === moduleFilter : true;
        return matchesSearch && matchesModule;
    });
  }, [assignments, search, moduleFilter]);

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const paginatedAssignments = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredAssignments.slice(start, start + itemsPerPage);
  }, [filteredAssignments, page]);

  const openModal = (assignment?: any) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        description: assignment.description,
        moduleId: assignment.moduleId
      });
    } else {
      setEditingAssignment(null);
      setFormData({ description: "", moduleId: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingAssignment) {
        await updateAssignment({ id: editingAssignment.id, data: { description: formData.description } }).unwrap();
        toast.success("Assignment updated successfully!");
      } else {
        await createAssignment(formData).unwrap();
        toast.success("Assignment created successfully!");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to save assignment. Note: A module can only have one assignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        await deleteAssignment(id).unwrap();
        toast.success("Assignment deleted successfully!");
      } catch (err: any) {
        toast.error(err.data?.message || "Failed to delete assignment");
      }
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Assignment Details",
      accessor: (assignment) => <p className="font-bold text-foreground text-sm line-clamp-2 max-w-sm">{assignment.description}</p>
    },
    {
      header: "Module",
      accessor: (assignment) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground">{assignment.module?.title || "N/A"}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{assignment.module?.course?.title || ""}</span>
        </div>
      )
    },
    {
      header: "Submission Type",
      align: "center",
      accessor: () => (
        <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20`}>
          Standard
        </div>
      )
    },
    {
      header: "Actions",
      align: "right",
      accessor: (assignment) => (
        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => openModal(assignment)}
            className="h-9 px-4 bg-background border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2 shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => handleDelete(assignment.id)}
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
        badgeIcon={<FileText className="w-3.5 h-3.5" />}
        badgeText="Course Evaluation"
        title="Manage Assignments."
        subtitle="Create tasks, require submissions, and evaluate student progress with structured assignments."
        action={
          <button
            onClick={() => openModal()}
            className="h-14 px-8 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Assignment
          </button>
        }
      />

      <DashboardFilterBar 
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder="Search assignments..."
        filterValue={moduleFilter}
        onFilterChange={(val) => { setModuleFilter(val); setPage(1); }}
        filterPlaceholder="All Modules"
        filterOptions={modules.map((m: any) => ({ value: m.id, label: m.title }))}
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
          data={paginatedAssignments}
          isLoading={queriesLoading}
          loadingMessage="Loading Assignments..."
          emptyState={{
            title: "No Assignments Found.",
            description: "Start challenging your students to test their knowledge.",
            icon: <FileText className="w-12 h-12" />
          }}
        />
      </DashboardCard>
     

      {/* Modern Dialog Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border/60 w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button onClick={closeModal} className="absolute right-8 top-8 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-8">
              <h2 className="text-2xl font-black tracking-tight italic">{editingAssignment ? "Edit Assignment." : "New Assignment."}</h2>
              <p className="text-sm text-muted-foreground font-medium">Configure the assignment details and requirements.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Target Module</label>
                <select
                  required
                  disabled={!!editingAssignment}
                  value={formData.moduleId}
                  onChange={e => setFormData({ ...formData, moduleId: e.target.value })}
                  className="w-full h-14 px-6 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm cursor-pointer disabled:opacity-50"
                >
                  <option value="" disabled>Select a module...</option>
                  {modules.map((mod: any) => (
                    <option key={mod.id} value={mod.id}>{mod.title} ({mod.course?.title || "N/A"})</option>
                  ))}
                </select>
                {!editingAssignment && <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-2 px-2">Note: A module can only contain one assignment.</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Assignment Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Write a 500 word essay about React components..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-6 py-4 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:opacity-50 resize-none"
                />
              </div>

              <div className="pt-6 flex justify-end gap-3 flex-col sm:flex-row">
                <button type="button" onClick={closeModal} className="h-14 px-8 bg-secondary/50 hover:bg-secondary rounded-2xl text-xs font-black uppercase tracking-widest text-foreground transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="h-14 px-8 bg-primary rounded-2xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-primary/20">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingAssignment ? "Save Changes" : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
