"use client";

import { Edit2, Plus, Loader2, BookOpen, Eye, Trash2, CloudUpload, CloudOff, Layers, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CourseList({ courses, isLoading, onEdit, onAddModule, onDelete, onTogglePublish, onFeatureRequest }: any) {
  
  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Loading Catalog...</p>
        </div>
    );
  }

  const courseData = courses?.data?.courses || [];

  if (courseData.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center py-40 text-center space-y-6">
            <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center text-muted-foreground/20">
                <BookOpen className="w-12 h-12" />
            </div>
            <div className="space-y-1">
                <h4 className="text-xl font-black italic">No Courses Found.</h4>
                <p className="text-sm font-medium text-muted-foreground">Start by creating your first course.</p>
            </div>
        </div>
      )
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/30">
            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">Course Identity</th>
            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">Instructor</th>
            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">Price</th>
            <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">Enrolled</th>
            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border/50">
          {courseData.map((course: any) => (
            <tr key={course.id} className="group hover:bg-muted/20 transition-colors">
              <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-border/50 flex-shrink-0 bg-muted">
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground/30">
                                <BookOpen className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <p className="font-bold text-foreground text-sm line-clamp-1">{course.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${course.isPublished ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"}`}>
                            <div className={`w-1 h-1 rounded-full ${course.isPublished ? "bg-green-500 animate-pulse" : "bg-orange-500"}`} />
                            {course.isPublished ? "Live" : "Draft"}
                          </span>
                          {course.isFeatured && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                                <Sparkles className="w-2 h-2" /> Featured
                            </span>
                          )}
                        </div>
                    </div>
                  </div>
              </td>

              <td className="px-8 py-6">
                 <p className="text-xs font-bold text-muted-foreground">{(course.instructor as any)?.name || "N/A"}</p>
              </td>

              <td className="px-8 py-6 text-right">
                 <p className="font-black text-foreground">${course.price || 0}</p>
              </td>

              <td className="px-8 py-6 text-center">
                 <div className="inline-flex items-center justify-center px-3 py-1 bg-secondary rounded-full text-xs font-bold text-muted-foreground">
                    {course.enrolledUsers?.length || course._count?.enrolledUsers || 0}
                 </div>
              </td>

              <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end gap-2 transition-opacity">
                  <button 
                    onClick={() => onTogglePublish(course.id, course.isPublished, course.title)}
                    className={`h-9 w-9 border border-border/50 rounded-xl transition-all flex items-center justify-center shadow-sm ${course.isPublished ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white border-orange-500/20" : "bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border-green-500/20"}`}
                    title={course.isPublished ? "Unpublish Course" : "Publish Course"}
                  >
                    {course.isPublished ? <CloudOff className="w-3.5 h-3.5" /> : <CloudUpload className="w-3.5 h-3.5" />}
                  </button>
                  
                  <button
                    onClick={() => onFeatureRequest(course.id, course.title)}
                    disabled={course.isFeatured || course.featureRequested}
                    className={`h-9 w-9 border border-border/50 rounded-xl transition-all flex items-center justify-center shadow-sm ${
                      course.isFeatured ? "bg-yellow-500/10 text-yellow-600 cursor-not-allowed" : 
                      course.featureRequested ? "bg-blue-500/10 text-blue-500 cursor-not-allowed" : 
                      "bg-background text-muted-foreground hover:bg-yellow-500 hover:text-white hover:border-yellow-500"
                    }`}
                    title={course.isFeatured ? "Featured Course" : course.featureRequested ? "Request Pending" : "Request Feature Status ($50)"}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${course.featureRequested ? "animate-pulse" : ""}`} />
                  </button>

                  <Link
                    href={`/courses/${course.id}`}
                    className="h-9 w-9 bg-background border border-border/50 rounded-xl text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center shadow-sm"
                    title="View Public Page"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => onEdit(course)}
                    className="h-9 w-9 bg-background border border-border/50 rounded-xl text-muted-foreground hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all flex items-center justify-center shadow-sm"
                    title="Edit Course"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                
                  <button
                    onClick={() => onAddModule(course)}
                    className="h-9 w-9 bg-background border border-border/50 rounded-xl text-muted-foreground hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all flex items-center justify-center shadow-sm"
                    title="Add Module"
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDelete(course.id)}
                    className="h-9 w-9 bg-background border border-border/50 rounded-xl text-muted-foreground hover:bg-destructive hover:text-white hover:border-destructive transition-all flex items-center justify-center shadow-sm"
                    title="Delete Course"
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
  );
}