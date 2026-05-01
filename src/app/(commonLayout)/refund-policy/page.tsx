"use client";

import { useTranslation } from "react-i18next";
import { RotateCcw, ShieldCheck, Clock, Percent, Mail, ArrowDown } from "lucide-react";

export default function RefundPolicyPage() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen bg-background pb-32">
      
      {/* --- Page Header --- */}
      <section className="relative pt-32 pb-20 overflow-hidden text-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-1/2 w-[40rem] h-[40rem] bg-amber-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background border border-border rounded-full shadow-sm text-primary">
              <RotateCcw className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t("refund_policy.badge")}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
              {t("refund_policy.title_start")} <br />
              <span className="text-primary italic font-serif">{t("refund_policy.title_end")}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              {t("refund_policy.subtitle")}
            </p>

            <div className="flex justify-center pt-8">
               <div className="animate-bounce w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground">
                  <ArrowDown className="w-5 h-5" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Content Area --- */}
      <section className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
             <FeatureCard 
                icon={<Clock />}
                title={t("refund_policy.feature1_title")}
                desc={t("refund_policy.feature1_desc")}
             />
             <FeatureCard 
                icon={<Percent />}
                title={t("refund_policy.feature2_title")}
                desc={t("refund_policy.feature2_desc")}
             />
             <FeatureCard 
                icon={<ShieldCheck />}
                title={t("refund_policy.feature3_title")}
                desc={t("refund_policy.feature3_desc")}
             />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
             <div className="space-y-10">
                <h2 className="text-4xl font-black tracking-tight leading-tight">{t("refund_policy.standards_title")} <br /><span className="text-primary">{t("refund_policy.standards_subtitle")}</span></h2>
                <div className="space-y-6">
                   <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                     {t("refund_policy.standards_desc")}
                   </p>
                   <ul className="space-y-4">
                      {[
                        t("refund_policy.list_item1"),
                        t("refund_policy.list_item2"),
                        t("refund_policy.list_item3"),
                        t("refund_policy.list_item4")
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-foreground">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                           {item}
                        </li>
                      ))}
                   </ul>
                </div>
             </div>

             <div className="p-12 bg-card border border-border rounded-[3rem] space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="space-y-2">
                   <h3 className="text-2xl font-black tracking-tight">{t("refund_policy.request_title")}</h3>
                   <p className="text-muted-foreground text-sm font-medium">{t("refund_policy.request_subtitle")}</p>
                </div>

                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 font-black text-xs">1</div>
                      <p className="text-sm font-medium leading-relaxed">{t("refund_policy.step1")}</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 font-black text-xs">2</div>
                      <p className="text-sm font-medium leading-relaxed">{t("refund_policy.step2")}</p>
                   </div>
                </div>

                <a href="mailto:support@coursemaster.com" className="h-16 w-full bg-primary text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1">
                   <Mail className="w-5 h-5" />
                   support@coursemaster.com
                </a>
             </div>
          </div>

        </div>
      </section>

    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string, desc: string }) {
  return (
    <div className="p-8 bg-card border border-border rounded-[2.5rem] space-y-6 hover:border-primary/30 transition-all group">
      <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
         {icon}
      </div>
      <div className="space-y-2">
         <h4 className="text-xl font-black tracking-tight">{title}</h4>
         <p className="text-sm text-muted-foreground font-medium leading-relaxed">
           {desc}
         </p>
      </div>
    </div>
  );
}
