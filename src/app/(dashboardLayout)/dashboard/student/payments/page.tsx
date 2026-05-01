"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetMyEnrollmentsQuery } from "@/redux/features/enroll/enrollApi";
import { History, CreditCard, Calendar, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { TableSkeleton } from "@/components/dashboard/skeletons";

export default function StudentPaymentsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetMyEnrollmentsQuery();
  const enrollments: any[] = useMemo(() => Array.isArray(data?.data?.enrollments) ? data.data.enrollments : (Array.isArray(data?.data) ? data.data : []), [data]);

  const totalInvestment = useMemo(() => 
    enrollments.reduce((sum, item) => sum + (item.course?.price || 0), 0), 
  [enrollments]);

  if (isLoading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-20 bg-muted rounded-[2rem] w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="h-32 bg-muted rounded-[2.5rem]"></div>
           <div className="h-32 bg-muted rounded-[2.5rem]"></div>
           <div className="h-32 bg-muted rounded-[2.5rem]"></div>
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      
      {/* ================= PREMIUM HEADER ================= */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full">
              <History className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t("student.payments.badge")}</span>
           </div>
           <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.9]">
              {t("student.payments.title")} <br />
              <span className="text-primary italic font-serif">{t("student.payments.subtitle_italic")}</span>
           </h1>
           <p className="text-muted-foreground text-lg font-medium max-w-xl leading-relaxed">
              {t("student.payments.description")}
           </p>
        </div>
      </section>

      {/* ================= SUMMARY STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-card border border-border rounded-[2.5rem] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">{t("student.payments.total_investment")}</p>
           <h3 className="text-4xl font-black text-foreground tracking-tighter">${totalInvestment.toLocaleString()}</h3>
        </div>
        <div className="p-8 bg-card border border-border rounded-[2.5rem] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">{t("student.payments.active_assets")}</p>
           <h3 className="text-4xl font-black text-foreground tracking-tighter">{enrollments.length}</h3>
        </div>
        <div className="p-8 bg-primary text-white rounded-[2.5rem] relative overflow-hidden group shadow-xl shadow-primary/20">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-4">{t("student.payments.status_label")}</p>
           <h3 className="text-4xl font-black tracking-tighter flex items-center gap-3">
              {t("student.payments.verified")}
              <CheckCircle2 className="w-8 h-8 opacity-40" />
           </h3>
        </div>
      </div>

      {/* ================= TRANSACTION TABLE ================= */}
      <div className="bg-card border border-border rounded-[3.5rem] overflow-hidden">
        <div className="p-10 border-b border-border/50 bg-secondary/20">
           <h2 className="text-2xl font-black tracking-tight">{t("student.payments.recent_transactions")}</h2>
           <p className="text-muted-foreground font-medium text-xs">{t("student.payments.transaction_subtitle")}</p>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-secondary/10 border-b border-border/50">
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("student.payments.table.details")}</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("student.payments.table.date")}</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("student.payments.table.status")}</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">{t("student.payments.table.amount")}</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                 {enrollments.map((item) => (
                    <tr key={item.id} className="hover:bg-secondary/5 transition-colors group">
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden">
                                <img src={item.course?.thumbnail || "/placeholder.png"} className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <p className="text-sm font-black text-foreground">{item.course?.title}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("student.payments.table.verified")}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-2 text-muted-foreground">
                             <Calendar className="w-3.5 h-3.5" />
                             <span className="text-xs font-bold">{new Date(item.enrolledAt).toLocaleDateString()}</span>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                             <CheckCircle2 className="w-3 h-3" />
                             {t("student.payments.table.completed")}
                          </span>
                       </td>
                       <td className="px-10 py-8 text-right">
                          <p className="text-lg font-black text-foreground tracking-tighter">
                             ${item.course?.price?.toLocaleString() || 0}
                          </p>
                       </td>
                    </tr>
                 ))}
                 {enrollments.length === 0 && (
                    <tr>
                       <td colSpan={4} className="px-10 py-20 text-center">
                          <p className="text-muted-foreground font-medium italic">{t("student.payments.table.no_data")}</p>
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

    </div>
  );
}
