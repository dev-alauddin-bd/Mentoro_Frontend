"use client";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, Tag, Loader2, Sparkles, FolderPlus, ArrowRight, X } from "lucide-react";
import { ICategory } from "@/interfaces/category.interface";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from "@/redux/features/category/categoriesApi";
import { toast } from "react-hot-toast";
import Pagination from "@/components/common/Pagination";
import DashboardHeader from "@/components/common/DashboardHeader";
import DashboardCard from "@/components/common/DashboardCard";
import DashboardFilterBar from "@/components/common/DashboardFilterBar";
import DataTable, { Column } from "@/components/common/DataTable";

export default function CategoryPage() {
  const [page, setPage] = useState(1);
  const limit = 8;
  const { data: response, isLoading } = useGetCategoriesQuery({ page, limit });
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const categories = response?.data?.categories || response?.data || [];

  const filteredCategories = useMemo(() => {
    return categories.filter((cat: ICategory) => 
        cat.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const { register, handleSubmit, reset, setValue } = useForm<ICategory>();

  const onSubmit = async (data: ICategory) => {
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id!, body: { name: data.name } }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory({ name: data.name }).unwrap();
        toast.success("New category added");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingCategory(null);
    reset();
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete).unwrap();
      toast.success("Category removed from catalog");
    } catch (err: any) {
      toast.error(err?.data?.message || "Deletion failed");
    } finally {
      setCategoryToDelete(null);
    }
  };

  const columns: Column<ICategory>[] = [
    {
      header: "Category Name",
      accessor: (cat) => (
        <div className="flex items-center gap-4">
             <div className="h-10 w-10 bg-secondary flex items-center justify-center rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
                <Tag className="w-4 h-4" />
             </div>
             <div>
                <p className="font-bold text-foreground">{cat.name}</p>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">ID: {cat.id?.slice(0, 8)}</p>
             </div>
        </div>
      )
    },
    {
      header: "Actions",
      align: "right",
      accessor: (cat) => (
        <div className="flex items-center justify-end gap-3 transition-all duration-300">
            <button
                onClick={() => handleEdit(cat)}
                className="h-9 px-4 bg-background border border-border/50 cursor-pointer rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2 shadow-sm"
            >
                <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
                onClick={() => setCategoryToDelete(cat.id!)}
                className="h-9 w-9 bg-background border border-border/50 cursor-pointer rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10">
      <DashboardHeader 
        badgeIcon={<Tag className="w-3.5 h-3.5" />}
        badgeText="Taxonomy Management"
        title="Manage Categories."
        subtitle="Organize your educational content with a robust category hierarchy. These will appear as primary filters in the marketplace."
        action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-14 cursor-pointer px-8 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Create Category
            </button>
          }
      />

      <DashboardFilterBar 
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search categories..."
      />

      <DashboardCard
        footer={
          response?.data?.totalPages > 1 && (
            <Pagination 
                currentPage={page}
                totalPages={response?.data?.totalPages}
                onPageChange={(newPage) => setPage(newPage)}
            />
          )
        }
      >
        <DataTable
          columns={columns}
          data={filteredCategories}
          isLoading={isLoading}
          loadingMessage="Syncing catalog..."
          emptyState={{
            title: "Catalog is Empty.",
            description: "Get started by creating your first course category.",
            icon: <Plus className="w-12 h-12" />
          }}
        />
      </DashboardCard>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/90 z-50 flex justify-center items-center p-4">
          <div className="bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 relative">
            <button 
                onClick={closeModal}
                className="absolute cursor-pointer right-8 top-8 text-muted-foreground hover:text-foreground transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
            
            <div className="mb-8">
                <h3 className="text-2xl font-black italic tracking-tight">
                    {editingCategory ? "Update Category" : "New Category"}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                    Define the name and label for this taxonomy entry.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Category Label</label>
                    <div className="relative group">
                         <div className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Tag className="w-4 h-4" />
                         </div>
                         <input
                            {...register("name", { required: true })}
                            placeholder="Ex. Data Science"
                            className="h-14 w-full bg-secondary/30 border border-transparent rounded-2xl pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:bg-background outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button 
                        type="button" 
                        onClick={closeModal}
                        className="h-14 flex-1 bg-secondary/50 cursor-pointer text-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isCreating || isUpdating}
                        className="h-14 flex-[2] bg-primary cursor-pointer text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all"
                    >
                        {isCreating || isUpdating ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : editingCategory ? <Edit2 className="w-4 h-4 text-white" /> : <FolderPlus className="w-4 h-4 text-white" />}
                        {editingCategory ? "Apply Changes" : "Create Category"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-background/90 z-50 flex justify-center items-center p-4">
          <div className="bg-card border border-red-500/20 rounded-[2.5rem] p-8 shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-2">Delete Category?</h3>
            <p className="text-sm font-medium text-muted-foreground mb-8">
              Permanently delete this category? All associated courses will be affected. This cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
                <button 
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="h-12 w-full bg-red-500 text-white cursor-pointer rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete It"}
                </button>
                <button 
                    onClick={() => setCategoryToDelete(null)}
                    disabled={isDeleting}
                    className="h-12 w-full cursor-pointer bg-secondary/50 text-foreground rounded-xl font-black uppercase tracking-widest text-xs hover:bg-secondary transition-colors"
                >
                    Cancel
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

