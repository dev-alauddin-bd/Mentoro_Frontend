"use client"
import { useState } from "react";
import toast from "react-hot-toast";
import { 
  useGetAllLessonsQuery, 

  useUpdateLessonMutation, 
  useDeleteLessonMutation,
  useGetAllModulesQuery
} from "@/redux/features/module/courseModuleApi";
import { Loader2, Plus, Edit, Trash2, X, PlayCircle } from "lucide-react";
import { useAddLessonMutation } from "@/redux/features/lesson/lessonApi";

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
  const [formData, setFormData] = useState({ title: "", videoUrl: "", duration: 0, moduleId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingLesson) {
        await updateLesson({ lessonId: editingLesson.id, data: { ...formData, duration: Number(formData.duration) } }).unwrap();
        toast.success("Lesson updated successfully!");
      } else {
        console.log("Adding new lesson with data:", formData);
        await addLesson({ ...formData, duration: Number(formData.duration) }).unwrap();
        toast.success("Lesson created successfully!");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to save lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
              <PlayCircle className="w-3.5 h-3.5" /> Course Content
           </div>
           <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-tight italic">
              Manage Lessons.
           </h1>
           <p className="text-muted-foreground font-medium max-w-xl">
              Upload videos, set durations, and build out the granular content of your educational modules.
           </p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="h-14 px-8 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Lesson
        </button>
      </div>

      {queriesLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Loading Lessons...</p>
        </div>
      ) : (
        <div className="bg-card border border-border/60 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5">
          {lessons.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-40 text-center space-y-6">
                <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center text-muted-foreground/20">
                    <PlayCircle className="w-12 h-12" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-xl font-black italic">No Lessons Found.</h4>
                    <p className="text-sm font-medium text-muted-foreground">Start adding engaging content to your modules.</p>
                </div>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">Lesson Title</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">Module</th>
                    <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">Duration</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {lessons.map((les: any) => (
                    <tr key={les.id} className="group hover:bg-muted/20 transition-colors">
                      <td className="px-8 py-6">
                          <p className="font-bold text-foreground text-sm line-clamp-1">{les.title}</p>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col">
                            <span className="font-bold text-sm text-foreground">{les.module?.title || "N/A"}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{les.module?.course?.title || ""}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="inline-flex items-center justify-center px-3 py-1 bg-secondary rounded-full text-xs font-bold text-muted-foreground">
                            {les.duration}m
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => openModal(les)}
                                className="h-9 px-4 bg-background border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2 shadow-sm"
                            >
                                <Edit className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(les.id)}
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
          )}
        </div>
      )}

      {/* Modern Dialog Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border/60 w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button onClick={closeModal} className="absolute right-8 top-8 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
            </button>
            <div className="mb-8">
                <h2 className="text-2xl font-black tracking-tight italic">{editingLesson ? "Edit Lesson" : "Create New Lesson"}</h2>
                <p className="text-sm text-muted-foreground font-medium">Configure your lesson details below.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Lesson Title</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Setting up Environment"
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full h-14 px-6 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:opacity-50"
                />
              </div>

               <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Video URL</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. YouTube or Vimeo link"
                  value={formData.videoUrl} 
                  onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                  className="w-full h-14 px-6 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Duration (minutes)</label>
                <input 
                  required
                  type="number"
                  min="0"
                  value={formData.duration} 
                  onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                  className="w-full h-14 px-6 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold placeholder:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Assign to Module</label>
                <select 
                  required
                  disabled={!!editingLesson}
                  value={formData.moduleId} 
                  onChange={e => setFormData({...formData, moduleId: e.target.value})}
                  className="w-full h-14 px-6 bg-secondary/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm cursor-pointer disabled:opacity-50"
                >
                  <option value="" disabled>Select a module...</option>
                  {modules.map((mod: any) => (
                    <option key={mod.id} value={mod.id}>{mod.title} ({mod.course?.title || "N/A"})</option>
                  ))}
                </select>
              </div>

              <div className="pt-6 flex justify-end gap-3 flex-col sm:flex-row">
                <button type="button" onClick={closeModal} className="h-14 px-8 bg-secondary/50 hover:bg-secondary rounded-2xl text-xs font-black uppercase tracking-widest text-foreground transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="h-14 px-8 bg-primary rounded-2xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-primary/20">
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingLesson ? "Save Changes" : "Create Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
