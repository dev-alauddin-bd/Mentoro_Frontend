"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Users, 
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  MapPin,
  Calendar,
  Eye,
  X,
  Loader2
} from "lucide-react"
import { 
  useGetAllJobsQuery, 
  useCreateJobMutation, 
  useUpdateJobMutation, 
  useDeleteJobMutation,
  useGetAllApplicationsQuery 
} from "@/redux/features/job/jobApi"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { format } from "date-fns"

export default function ManageJobsPage() {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAppsModalOpen, setIsAppsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<any>(null)
  const [viewingAppsJobId, setViewingAppsJobId] = useState<string | null>(null)

  const { data: jobsData, isLoading: isLoadingJobs } = useGetAllJobsQuery({})
  const { data: appsData, isLoading: isLoadingApps } = useGetAllApplicationsQuery(undefined, { skip: !isAppsModalOpen })
  
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation()
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation()
  const [deleteJob] = useDeleteJobMutation()

  const { register, handleSubmit, reset, setValue } = useForm()

  const jobs = jobsData?.data?.jobs || jobsData?.data || []
  const applications = appsData?.data?.applications || appsData?.data || []
  const filteredApps = viewingAppsJobId 
    ? applications.filter((app: any) => app.jobId === viewingAppsJobId)
    : applications

  const handleOpenModal = (job?: any) => {
    if (job) {
      setEditingJob(job)
      setValue("title", job.title)
      setValue("category", job.category)
      setValue("location", job.location)
      setValue("type", job.type)
      setValue("salary", job.salary)
      setValue("deadline", job.deadline ? format(new Date(job.deadline), "yyyy-MM-dd") : "")
      setValue("description", job.description)
      setValue("isPublished", job.isPublished)
    } else {
      setEditingJob(null)
      reset()
    }
    setIsModalOpen(true)
  }

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null
      }
      
      if (editingJob) {
        await updateJob({ id: editingJob.id, data: formattedData }).unwrap()
        toast.success("Job updated successfully")
      } else {
        await createJob(formattedData).unwrap()
        toast.success("Job created successfully")
      }
      setIsModalOpen(false)
      reset()
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(id).unwrap()
        toast.success("Job deleted successfully")
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete job")
      }
    }
  }

  return (
    <div className="p-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground">{t("nav.manage_jobs") || "Manage Careers"}</h1>
          <p className="text-muted-foreground text-sm font-medium">Control the platform's job board and track applications.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsAppsModalOpen(true)}
             className="h-12 px-6 bg-secondary text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-secondary/80 transition-all"
           >
             <Users className="w-4 h-4" /> View All Applications
           </button>
           <button 
             onClick={() => handleOpenModal()}
             className="h-12 px-6 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
           >
             <Plus className="w-4 h-4" /> Post New Job
           </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <StatCard label="Total Jobs" value={jobs.length} icon={<Briefcase className="w-5 h-5" />} color="text-blue-500" />
         <StatCard label="Active Listings" value={jobs.filter((j: any) => j.isPublished).length} icon={<CheckCircle2 className="w-5 h-5" />} color="text-emerald-500" />
         <StatCard label="Total Applications" value={applications.length} icon={<Users className="w-5 h-5" />} color="text-primary" />
      </div>

      {/* Jobs Table */}
      <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
         <div className="p-6 border-b border-border bg-secondary/10 flex items-center justify-between">
            <div className="relative w-full max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <input placeholder="Search jobs..." className="w-full h-11 pl-11 pr-4 bg-background border border-border rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
            <button className="h-11 w-11 flex items-center justify-center bg-background border border-border rounded-xl hover:bg-secondary transition-all">
               <Filter className="w-4 h-4 text-muted-foreground" />
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                     <th className="px-8 py-5">Job Details</th>
                     <th className="px-8 py-5">Category & Type</th>
                     <th className="px-8 py-5">Deadline</th>
                     <th className="px-8 py-5">Status</th>
                     <th className="px-8 py-5">Apps</th>
                     <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                  {jobs.map((job: any) => (
                     <tr key={job.id} className="group hover:bg-secondary/20 transition-all">
                        <td className="px-8 py-6">
                           <div className="space-y-1">
                              <p className="font-black text-sm text-foreground">{job.title}</p>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold">
                                 <MapPin className="w-3 h-3 text-primary/60" /> {job.location}
                                 <span className="text-border">|</span>
                                 <span>{job.salary}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col gap-1.5">
                              <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest w-fit">
                                 {job.category}
                              </span>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                 {job.type}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />
                              {job.deadline ? format(new Date(job.deadline), "MMM dd, yyyy") : "N/A"}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           {job.isPublished ? (
                              <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                 <CheckCircle2 className="w-3.5 h-3.5" /> Published
                              </div>
                           ) : (
                              <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                                 <Clock className="w-3.5 h-3.5" /> Draft
                              </div>
                           )}
                        </td>
                        <td className="px-8 py-6 text-center">
                           <button 
                             onClick={() => { setViewingAppsJobId(job.id); setIsAppsModalOpen(true); }}
                             className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all font-black text-xs"
                           >
                             {job.applications?.length || 0}
                           </button>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleOpenModal(job)} className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-blue-500 hover:border-blue-500/30 transition-all">
                                 <Edit3 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(job.id)} className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-rose-500 hover:border-rose-500/30 transition-all">
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Post/Edit Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-3xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
               <div className="p-10 space-y-8">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tight">{editingJob ? "Edit Job Listing" : "Post New Career"}</h2>
                        <p className="text-muted-foreground text-sm font-medium">Fill in the details for the open position.</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-secondary hover:bg-rose-500/10 hover:text-rose-500 transition-all">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Job Title" register={register("title", { required: true })} placeholder="e.g. Senior Product Designer" />
                        <FormField label="Category" register={register("category", { required: true })} placeholder="e.g. Design" />
                        <FormField label="Location" register={register("location", { required: true })} placeholder="e.g. Remote" />
                        <FormField label="Job Type" register={register("type", { required: true })} placeholder="e.g. Full-time" />
                        <FormField label="Salary Budget" register={register("salary")} placeholder="e.g. $50k - $80k" />
                        <FormField label="Application Deadline" register={register("deadline")} type="date" />
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Job Description</label>
                        <textarea {...register("description", { required: true })} rows={4} className="w-full p-6 bg-secondary/30 border border-border rounded-[2rem] focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold resize-none" placeholder="Detailed job description..." />
                     </div>

                     <div className="flex items-center gap-3 bg-secondary/20 p-6 rounded-2xl border border-border">
                        <input type="checkbox" {...register("isPublished")} className="w-5 h-5 rounded-lg accent-primary" />
                        <label className="text-xs font-black uppercase tracking-widest text-foreground">Publish Listing Immediately</label>
                     </div>

                     <button 
                       disabled={isCreating || isUpdating}
                       className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all disabled:opacity-70"
                     >
                        {(isCreating || isUpdating) ? <Loader2 className="w-5 h-5 animate-spin" /> : editingJob ? "Update Listing" : "Create Listing"}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      )}

      {/* Applications Modal */}
      {isAppsModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => { setIsAppsModalOpen(false); setViewingAppsJobId(null); }} />
            <div className="relative w-full max-w-5xl bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
               <div className="p-10 space-y-8">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tight">Job Applications</h2>
                        <p className="text-muted-foreground text-sm font-medium">
                           {viewingAppsJobId ? "Viewing candidates for this specific role." : "All candidates across all open positions."}
                        </p>
                     </div>
                     <button onClick={() => { setIsAppsModalOpen(false); setViewingAppsJobId(null); }} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-secondary hover:bg-rose-500/10 hover:text-rose-500 transition-all">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                     {isLoadingApps ? (
                       <div className="flex flex-col items-center py-20 gap-4">
                         <Loader2 className="w-10 h-10 animate-spin text-primary" />
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fetching Candidates...</p>
                       </div>
                     ) : filteredApps.length > 0 ? (
                       <div className="grid grid-cols-1 gap-4">
                          {filteredApps.map((app: any) => (
                             <div key={app.id} className="p-6 bg-secondary/20 border border-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 transition-all">
                                <div className="space-y-3">
                                   <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                                         {app.fullName.charAt(0)}
                                      </div>
                                      <div>
                                         <p className="font-black text-sm text-foreground">{app.fullName}</p>
                                         <p className="text-[10px] font-bold text-muted-foreground">{app.email}</p>
                                      </div>
                                   </div>
                                   {!viewingAppsJobId && (
                                      <div className="flex items-center gap-2">
                                         <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Applied For:</span>
                                         <span className="text-[9px] font-black text-primary uppercase">{app.job?.title}</span>
                                      </div>
                                   )}
                                </div>

                                <div className="flex flex-col md:items-end gap-3">
                                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {format(new Date(app.appliedAt), "MMM dd, hh:mm a")}
                                   </p>
                                   <div className="flex items-center gap-2">
                                      <a 
                                        href={app.resumeLink} 
                                        target="_blank" 
                                        className="h-10 px-4 bg-background border border-border rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
                                      >
                                         <Eye className="w-3.5 h-3.5" /> View Resume
                                      </a>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                     ) : (
                       <div className="py-20 text-center text-muted-foreground font-bold italic">
                          No applications found for this role.
                       </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  )
}

function StatCard({ label, value, icon, color }: any) {
  return (
    <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
       <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
             <h4 className="text-4xl font-black text-foreground tabular-nums">{value}</h4>
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
             {icon}
          </div>
       </div>
    </div>
  )
}

function FormField({ label, register, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-2">
       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{label}</label>
       <input type={type} {...register} className="w-full h-14 px-6 bg-secondary/30 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold" placeholder={placeholder} />
    </div>
  )
}
