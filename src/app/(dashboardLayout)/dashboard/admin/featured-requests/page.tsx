"use client";

import { useTranslation } from "react-i18next";
import { AdminCoursesTable } from "@/components/admin-courses-table";
import { Sparkles } from "lucide-react";

export default function FeaturedRequestsPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/5 border border-yellow-500/10 rounded-full text-yellow-600">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t("admin.featured_requests.pipeline")}</span>
           </div>
           <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.9]">
              {t("admin.featured_requests.title_start")} <br />
              <span className="text-primary italic font-serif">{t("admin.featured_requests.title_end")}</span>
           </h1>
           <p className="text-muted-foreground text-lg font-medium max-w-xl leading-relaxed">
              {t("admin.featured_requests.subtitle")}
           </p>
        </div>
      </section>

      {/* Requests Table */}
      <div className="bg-card border border-border rounded-[3.5rem] p-10 relative overflow-hidden">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="space-y-1">
             <h2 className="text-2xl font-black tracking-tight">{t("admin.featured_requests.pending_approvals")}</h2>
             <p className="text-muted-foreground font-medium text-xs">{t("admin.featured_requests.pending_subtitle")}</p>
          </div>
        </div>
        
        <div className="relative z-10">
          <AdminCoursesTable showAll={true} featureRequestedFilter={true} />
        </div>
      </div>

    </div>
  );
}
