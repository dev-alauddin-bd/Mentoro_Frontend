"use client"

import { useTranslation } from "react-i18next"
import { 
  Users, 
  Sparkles, 
  Heart, 
  Zap, 
  Coffee, 
  Globe, 
  ArrowRight, 
  Briefcase,
  MapPin,
  Clock,
  X,
  Loader2,
  Paperclip
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useGetAllJobsQuery, useApplyForJobMutation } from "@/redux/features/job/jobApi"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "react-toastify"

const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  resumeLink: z.string().url("Please provide a valid URL for your resume"),
  coverLetter: z.string().optional(),
})

type ApplicationForm = z.infer<typeof applicationSchema>

export default function CareersPage() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedJob, setSelectedJob] = useState<any>(null)

  const { data: jobsData, isLoading } = useGetAllJobsQuery({ category: activeCategory !== "All" ? activeCategory : undefined })
  const [applyForJob, { isLoading: isApplying }] = useApplyForJobMutation()

  const categories = [
    { id: "All", label: t("careers.categories.all") },
    { id: "Engineering", label: t("careers.categories.engineering") },
    { id: "Design", label: t("careers.categories.design") },
    { id: "Marketing", label: t("careers.categories.marketing") },
    { id: "Support", label: t("careers.categories.support") },
    { id: "Product", label: t("careers.categories.product") },
    { id: "Sales", label: t("careers.categories.sales") },
    { id: "HR", label: t("careers.categories.hr") },
    { id: "Finance", label: t("careers.categories.finance") },
    { id: "Operations", label: t("careers.categories.operations") },
    { id: "Management", label: t("careers.categories.management") },
    { id: "Content", label: t("careers.categories.content") },
    { id: "Customer Success", label: t("careers.categories.customer_success") }
  ]
  const jobs = jobsData?.data?.jobs || jobsData?.data || []

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema)
  })

  const onSubmit = async (data: ApplicationForm) => {
    try {
      await applyForJob({ ...data, jobId: selectedJob.id }).unwrap()
      toast.success("Application submitted successfully!")
      setSelectedJob(null)
      reset()
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit application")
    }
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Hero Section --- */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
             <Sparkles className="w-3.5 h-3.5" /> {t("careers.badge")}
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9]">
             {t("careers.title_start")} <br />
             <span className="text-primary italic font-serif">{t("careers.title_end")}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
             {t("careers.subtitle")}
          </p>
        </div>

        {/* --- Culture Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
           <CultureCard 
              icon={<Zap className="w-6 h-6" />}
              title={t("careers.culture1_title")}
              desc={t("careers.culture1_desc")}
           />
           <CultureCard 
              icon={<Heart className="w-6 h-6" />}
              title={t("careers.culture2_title")}
              desc={t("careers.culture2_desc")}
           />
           <CultureCard 
              icon={<Users className="w-6 h-6" />}
              title={t("careers.culture3_title")}
              desc={t("careers.culture3_desc")}
           />
        </div>

        {/* --- Open Positions Section --- */}
        <div className="space-y-16">
           <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-border pb-8">
              <div className="space-y-4">
                 <h2 className="text-4xl font-black tracking-tight">{t("careers.open_positions")}</h2>
                 <p className="text-muted-foreground font-medium">{t("careers.positions_subtitle")}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                 {categories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
                    >
                       {cat.label}
                    </button>
                 ))}
              </div>
           </div>

           {isLoading ? (
             <div className="flex flex-col items-center py-20 gap-4">
               <Loader2 className="w-10 h-10 animate-spin text-primary" />
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("careers.scanning")}</p>
             </div>
           ) : jobs.length > 0 ? (
             <div className="grid grid-cols-1 gap-6">
                {jobs.map((job: any) => (
                   <div key={job.id} className="group p-8 bg-card border border-border rounded-[2.5rem] hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                         <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                               <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest">
                                  {job.category}
                               </span>
                               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {job.type}
                               </span>
                            </div>
                            <h3 className="text-2xl font-black group-hover:text-primary transition-colors">{job.title}</h3>
                            <p className="text-muted-foreground text-sm font-medium max-w-2xl">{job.description}</p>
                         </div>

                         <div className="flex flex-wrap items-center gap-8 shrink-0">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("careers.location")}</p>
                               <div className="flex items-center gap-1.5 font-bold text-sm">
                                  <MapPin className="w-4 h-4 text-primary" /> {job.location}
                               </div>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("careers.budget")}</p>
                               <p className="font-black text-xl tabular-nums">{job.salary}</p>
                            </div>
                            <button 
                              onClick={() => setSelectedJob(job)}
                              className="h-14 px-8 bg-zinc-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-primary transition-all"
                            >
                               {t("careers.apply_now")} <ArrowRight className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
           ) : (
             <div className="py-20 text-center bg-secondary/20 rounded-[3rem] border border-dashed border-border">
                <p className="text-muted-foreground font-bold italic">{t("careers.no_positions")}</p>
             </div>
           )}
        </div>

        {/* --- Application Modal --- */}
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setSelectedJob(null)} />
             <div className="relative w-full max-w-2xl bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-10 space-y-8">
                   <div className="flex items-start justify-between">
                      <div className="space-y-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t("careers.applying_for")}</span>
                         <h2 className="text-3xl font-black tracking-tight">{selectedJob.title}</h2>
                      </div>
                      <button onClick={() => setSelectedJob(null)} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-secondary hover:bg-rose-500/10 hover:text-rose-500 transition-all">
                         <X className="w-5 h-5" />
                      </button>
                   </div>

                   <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t("careers.full_name")}</label>
                            <input {...register("fullName")} className={`w-full h-14 px-6 bg-secondary/30 border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold ${errors.fullName ? "border-rose-500" : "border-border"}`} placeholder="John Doe" />
                            {errors.fullName && <p className="text-[9px] text-rose-500 font-bold ml-1">{errors.fullName.message}</p>}
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t("careers.email_address")}</label>
                            <input {...register("email")} className={`w-full h-14 px-6 bg-secondary/30 border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold ${errors.email ? "border-rose-500" : "border-border"}`} placeholder="john@example.com" />
                            {errors.email && <p className="text-[9px] text-rose-500 font-bold ml-1">{errors.email.message}</p>}
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t("careers.resume_link")}</label>
                         <div className="relative">
                            <Paperclip className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input {...register("resumeLink")} className={`w-full h-14 pl-14 pr-6 bg-secondary/30 border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold ${errors.resumeLink ? "border-rose-500" : "border-border"}`} placeholder="https://drive.google.com/..." />
                         </div>
                         {errors.resumeLink && <p className="text-[9px] text-rose-500 font-bold ml-1">{errors.resumeLink.message}</p>}
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t("careers.cover_letter")}</label>
                         <textarea {...register("coverLetter")} rows={4} className="w-full p-6 bg-secondary/30 border border-border rounded-[2rem] focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold resize-none" placeholder="Tell us why you're a great fit..." />
                      </div>

                      <button 
                        disabled={isApplying}
                        className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                         {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t("careers.submit_app")} <ArrowRight className="w-4 h-4" /></>}
                      </button>
                   </form>
                </div>
             </div>
          </div>
        )}

        {/* --- Benefits Section --- */}
        <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-10">
              <div className="space-y-4">
                 <h2 className="text-5xl font-black tracking-tight">{t("careers.perks_title")}</h2>
                 <p className="text-muted-foreground font-medium leading-relaxed max-w-lg">
                    {t("careers.perks_subtitle")}
                 </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <BenefitItem icon={<Globe className="w-5 h-5" />} title={t("careers.benefit1_title")} desc={t("careers.benefit1_desc")} />
                 <BenefitItem icon={<Coffee className="w-5 h-5" />} title={t("careers.benefit2_title")} desc={t("careers.benefit2_desc")} />
                 <BenefitItem icon={<Zap className="w-5 h-5" />} title={t("careers.benefit3_title")} desc={t("careers.benefit3_desc")} />
                 <BenefitItem icon={<Sparkles className="w-5 h-5" />} title={t("careers.benefit4_title")} desc={t("careers.benefit4_desc")} />
              </div>
           </div>

           <div className="relative group">
              <div className="aspect-square bg-card border border-border rounded-[3.5rem] overflow-hidden p-12 flex flex-col justify-between shadow-2xl relative">
                 <div className="space-y-6">
                    <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-6 transition-transform">
                       <Briefcase className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-4xl font-black tracking-tighter">{t("careers.ready_join")}</h4>
                 </div>
                 
                 <div className="space-y-4">
                    <p className="text-sm font-medium text-muted-foreground">
                       {t("careers.testimonial_text")}
                    </p>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-secondary" />
                       <div>
                          <p className="text-xs font-black">{t("careers.testimonial_author")}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">{t("careers.testimonial_role")}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* --- Open Application --- */}
        <div className="mt-40 bg-zinc-950 rounded-[4rem] p-12 md:p-20 text-center space-y-10 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary"></div>
           <div className="space-y-4 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">{t("careers.no_role_title")}</h2>
              <p className="text-zinc-400 font-medium max-w-xl mx-auto">
                 {t("careers.no_role_desc")}
              </p>
           </div>
           <button className="h-16 px-10 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all relative z-10">
              {t("careers.send_app")}
           </button>
        </div>

      </div>
    </main>
  )
}

function CultureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 bg-card border border-border rounded-[3rem] hover:border-primary/20 transition-all duration-500 group">
       <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-8">
          {icon}
       </div>
       <h3 className="text-2xl font-black mb-4 italic">{title}</h3>
       <p className="text-muted-foreground text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  )
}

function BenefitItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
       <div className="w-10 h-10 shrink-0 bg-secondary rounded-xl flex items-center justify-center text-primary">
          {icon}
       </div>
       <div>
          <h4 className="font-bold text-foreground">{title}</h4>
          <p className="text-[10px] text-muted-foreground uppercase font-black">{desc}</p>
       </div>
    </div>
  )
}
