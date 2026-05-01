"use client"

import { useTranslation } from "react-i18next"
import { Sparkles, Target, Users, Award, ShieldCheck, Zap, ArrowRight, Heart } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen py-24 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-[50rem] h-[50rem] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-purple-500/5 blur-[120px] rounded-full translate-y-1/2 translate-x-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-32 relative z-10">
        
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                    <Zap className="w-3.5 h-3.5 fill-primary" /> {t("about.badge")}
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.85] italic">
                    {t("about.title")}
                </h1>
                <p className="text-xl md:text-2xl font-serif text-muted-foreground leading-relaxed">
                    {t("about.subtitle")}
                </p>
                <div className="flex gap-4 p-2 bg-background border border-border/50 rounded-3xl w-fit shadow-xl shadow-black/5">
                    <div className="px-6 py-3 bg-secondary/50 rounded-2xl">
                        <span className="block text-2xl font-black text-foreground">{t("info.students_val")}</span>
                        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{t("info.students")}</span>
                    </div>
                    <div className="px-6 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                        <span className="block text-2xl font-black">98%</span>
                        <span className="text-[10px] uppercase font-black tracking-widest opacity-80">{t("about.success_rate")}</span>
                    </div>
                </div>
            </div>

            <div className="relative aspect-square">
                 <div className="absolute inset-4 rounded-[4rem] bg-gradient-to-tr from-primary/20 to-purple-500/20 rotate-6 border border-primary/10 transition-transform hover:rotate-3 duration-700"></div>
                 <div className="absolute inset-4 rounded-[4rem] bg-background border border-border shadow-2xl flex items-center justify-center overflow-hidden">
                    <div className="p-12 space-y-6 text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/10 mb-2">
                            <Target className="w-10 h-10 text-primary animate-pulse" />
                        </div>
                        <h3 className="text-3xl font-black tracking-tight italic">{t("about.mission_title")}</h3>
                        <p className="font-medium text-muted-foreground leading-relaxed">{t("about.mission_desc")}</p>
                    </div>
                 </div>
            </div>
        </div>

        {/* Values Grid */}
        <div className="space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h2 className="text-4xl font-black tracking-tight italic">{t("about.values_title")}</h2>
                <p className="text-muted-foreground font-medium">{t("about.values_subtitle")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ValueCard icon={<Award />} title={t("about.value1_title")} desc={t("about.value1_desc")} />
                <ValueCard icon={<ShieldCheck />} title={t("about.value2_title")} desc={t("about.value2_desc")} />
                <ValueCard icon={<Users />} title={t("about.value3_title")} desc={t("about.value3_desc")} />
                <ValueCard icon={<Heart />} title={t("about.value4_title")} desc={t("about.value4_desc")} />
            </div>
        </div>

      
      </div>
    </main>
  )
}

function ValueCard({ icon, title, desc }: any) {
    return (
        <div className="p-8 bg-background border border-border rounded-[3rem] space-y-6 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                {icon}
            </div>
            <div className="space-y-2">
                <h4 className="text-2xl font-black tracking-tight">{title}</h4>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
