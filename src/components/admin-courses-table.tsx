"use client"

import { useMemo } from "react"
import { Eye, Edit, Trash2, Send, PowerOff, Star, CheckCircle } from "lucide-react"
import {  useTogglePublishMutation, useRequestFeatureMutation, useApproveFeatureMutation,  useGetAllPublicCoursesQuery } from "@/redux/features/course/courseAPi";
import { TableSkeleton } from "./dashboard/skeletons";
import { toast } from "react-hot-toast";

interface AdminCoursesTableProps {
  instructorId?: string;
  limit?: number;
  showAll?: boolean;
  featureRequestedFilter?: boolean;
}

  export function AdminCoursesTable({ instructorId, limit = 5, showAll, featureRequestedFilter }: AdminCoursesTableProps) {
  const { data, isLoading } = useGetAllPublicCoursesQuery(
    { limit: showAll ? 1000 : limit,  showAll },
    { skip: !instructorId && !showAll }
  );
  
  const [togglePublish, { isLoading: isToggling }] = useTogglePublishMutation();
  const [requestFeature, { isLoading: isRequesting }] = useRequestFeatureMutation();
  const [approveFeature, { isLoading: isApproving }] = useApproveFeatureMutation();

  const fetchedCourses = useMemo(() => data?.data?.courses || [], [data]);

  const courses = useMemo(() => fetchedCourses.map((c: any) => ({
    id: c.id,
    title: c.title,
    instructor: c.instructor?.name || "Unknown",
    students: c._count?.enrolledUsers || 0,
    revenue: `$${(c.price * (c._count?.enrolledUsers || 0)).toLocaleString()}`,
    status: c.isPublished ? "published" : "draft",
    isPublished: c.isPublished,
    isFeatured: c.isFeatured,
    featureRequested: c.featureRequested
  })), [fetchedCourses]);

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
    } catch (err) {
      // Error handled by toast.promise
    }
  };



  const handleApproveFeature = async (id: string, currentStatus: boolean, title: string) => {
    const action = currentStatus ? "Remove from Featured" : "Approve as Featured";
    try {
      await toast.promise(
        approveFeature({ id, isFeatured: !currentStatus }).unwrap(),
        {
          loading: `${currentStatus ? "Removing" : "Approving"}...`,
          success: `Successfully ${currentStatus ? "removed" : "approved"} "${title}"!`,
          error: (err) => err?.data?.message || "Operation failed",
        }
      );
    } catch (err) {}
  };

  if (isLoading) {
    return <TableSkeleton rows={limit} />;
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase text-[10px] tracking-widest">Course</th>
              {!instructorId && <th className="px-4 py-3 text-left font-semibold uppercase text-[10px] tracking-widest">Instructor</th>}
              <th className="px-4 py-3 text-center font-semibold uppercase text-[10px] tracking-widest">Students</th>
              <th className="px-4 py-3 text-right font-semibold uppercase text-[10px] tracking-widest">Revenue</th>
              <th className="px-4 py-3 text-center font-semibold uppercase text-[10px] tracking-widest">Status</th>
              <th className="px-4 py-3 text-center font-semibold uppercase text-[10px] tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? courses.map((course, idx) => (
              <tr
                key={course.id}
                className={`border-b border-border last:border-0 hover:bg-primary/5 transition-colors ${idx % 2 === 0 ? "bg-transparent" : "bg-muted/30"}`}
              >
                <td className="px-4 py-4 font-bold">{course.title}</td>
                {!instructorId && <td className="px-4 py-4 text-muted-foreground font-medium">{course.instructor}</td>}
                <td className="px-4 py-4 text-center font-medium">{course.students}</td>
                <td className="px-4 py-4 text-right font-black text-primary">{course.revenue}</td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${course.isPublished ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${course.isPublished ? "bg-green-500 animate-pulse" : "bg-orange-500"}`} />
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleTogglePublish(course.id, course.isPublished, course.title)}
                      disabled={isToggling}
                      className={`p-2 rounded-xl border transition-all ${course.isPublished ? "hover:bg-orange-500 hover:text-white border-orange-500/20 text-orange-500" : "hover:bg-green-500 hover:text-white border-green-500/20 text-green-500"}`} 
                      title={course.isPublished ? "Unpublish" : "Publish"}
                    >
                      {course.isPublished ? <PowerOff className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    </button>

            

                    <button className="p-2 bg-card hover:bg-primary/10 hover:text-primary border border-border rounded-xl transition shadow-sm" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-card hover:bg-destructive/10 hover:text-destructive border border-border rounded-xl transition shadow-sm" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={instructorId ? 5 : 6} className="px-4 py-12 text-center text-muted-foreground italic font-medium">
                  {featureRequestedFilter ? "No pending featured requests found." : "No courses found in your library."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

