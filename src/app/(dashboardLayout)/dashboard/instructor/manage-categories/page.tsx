"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, Tag, Loader2, Sparkles, FolderPlus, ArrowRight } from "lucide-react";
import { ICategory } from "@/interfaces/category.interface";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from "@/redux/features/category/categoriesApi";
import { toast } from "react-hot-toast";

export default function CategoryPage() {
  const { data: response, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

  const categories = response?.data?.categories || response?.data || [];

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
      reset();
      setEditingCategory(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setValue("name", category.name);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this category? All associated courses will be affected.")) {
      try {
        await deleteCategory(id).unwrap();
        toast.success("Category removed from catalog");
      } catch (err: any) {
        toast.error(err?.data?.message || "Deletion failed");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10 max-w-6xl">
      
      {/* Header Branding */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                <Tag className="w-3.5 h-3.5" /> Taxonomy Management
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-tight italic">
                {editingCategory ? "Update Master Category." : "Expand Your Catalog."}
            </h1>
            <p className="text-muted-foreground font-medium max-w-xl">
                Organize your educational content with a robust category hierarchy. These will appear as primary filters in the marketplace.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Creation/Edit Card */}
        <div className="lg:col-span-1 sticky top-24 bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-xl shadow-black/5">
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

                <div className="flex flex-col gap-3">
                    <button 
                        type="submit" 
                        disabled={isCreating || isUpdating}
                        className="h-14 w-full bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all"
                    >
                        {isCreating || isUpdating ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : editingCategory ? <Edit2 className="w-4 h-4 text-white" /> : <FolderPlus className="w-4 h-4 text-white" />}
                        {editingCategory ? "Apply Changes" : "Create Category"}
                    </button>
                    {editingCategory && (
                        <button 
                            type="button" 
                            onClick={() => {setEditingCategory(null); reset();}}
                            className="h-14 w-full bg-secondary/50 text-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-secondary transition-all"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>
        </div>

        {/* Categories Table Card */}
        <div className="lg:col-span-2 bg-card border border-border/60 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5">
            <div className="p-8 border-b border-border/50 flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight italic">Active Categories</h3>
                <span className="px-3 py-1 bg-secondary rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">{categories.length} Total</span>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
                    <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing catalog...</p>
                </div>
            ) : categories.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/30">
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">Category Name</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {categories.map((cat: ICategory) => (
                                <tr key={cat.id} className="group hover:bg-muted/20 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                             <div className="h-10 w-10 bg-secondary flex items-center justify-center rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                <Tag className="w-4 h-4" />
                                             </div>
                                             <div>
                                                <p className="font-bold text-foreground">{cat.name}</p>
                                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">ID: {cat.id?.slice(0, 8)}</p>
                                             </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="h-9 px-4 bg-background border border-border/50 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2 shadow-sm"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id!)}
                                                className="h-9 w-9 bg-background border border-border/50 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-40 text-center space-y-6">
                    <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center text-muted-foreground/20">
                        <Plus className="w-12 h-12" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xl font-black italic">Catalog is Empty.</h4>
                        <p className="text-sm font-medium text-muted-foreground">Get started by creating your first course category.</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
