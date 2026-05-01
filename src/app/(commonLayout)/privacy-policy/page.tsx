"use client";

import { useTranslation } from "react-i18next";
import { Shield, Lock, Eye, FileText, Sparkles, ArrowDown } from "lucide-react";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen bg-background pb-32">
      
      {/* --- Page Header --- */}
      <section className="relative pt-32 pb-20 overflow-hidden text-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background border border-border rounded-full shadow-sm text-primary">
              <Shield className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t("privacy_policy.badge")}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
              {t("privacy_policy.title_start")} <br />
              <span className="text-primary italic font-serif">{t("privacy_policy.title_end")}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              {t("privacy_policy.subtitle")}
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
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-16">
          
          <PolicySection 
            icon={<Eye />}
            title={t("privacy_policy.section1_title")}
            content={t("privacy_policy.section1_desc")}
          />

          <PolicySection 
            icon={<Lock />}
            title={t("privacy_policy.section2_title")}
            content={t("privacy_policy.section2_desc")}
          />

          <PolicySection 
            icon={<Sparkles />}
            title={t("privacy_policy.section3_title")}
            content={t("privacy_policy.section3_desc")}
          />

          <PolicySection 
            icon={<FileText />}
            title={t("privacy_policy.section4_title")}
            content={t("privacy_policy.section4_desc")}
          />

        </div>
      </section>

    </main>
  );
}

function PolicySection({ icon, title, content }: { icon: React.ReactNode; title: string, content: string }) {
  return (
    <div className="group relative p-8 md:p-12 bg-card border border-border rounded-[3rem] hover:border-primary/30 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-16 h-16 shrink-0 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
           {icon}
        </div>
        <div className="space-y-6">
           <h3 className="text-3xl font-black tracking-tight text-foreground">{title}</h3>
           <p className="text-muted-foreground text-lg font-medium leading-relaxed">
             {content}
           </p>
        </div>
      </div>
    </div>
  );
}
