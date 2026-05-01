"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ArrowRight, Wallet, Users, Zap, Globe } from "lucide-react";
import { trackEvent } from "@/lib/gtag";
import { Section } from "./ui/section";

export function InstructorCTA() {
  const { t } = useTranslation();

  return (
    <Section>
      {/* Main Boxed Container - Using OKLCH based colors */}
      <div className="relative overflow-hidden bg-card/40 rounded-[3rem] border border-primary/10  p-8 md:p-20" >


        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* Left Content */}
          <div className="max-w-xl space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-xs font-black uppercase text-primary tracking-widest">
              <Zap className="w-3 h-3 fill-primary animate-pulse" />
              {t("extra.for_instructors")}
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
              {t("extra.instructor_cta_title")} <br />
              <span className="text-muted-foreground font-serif italic">{t("extra.instructor_cta_millions")}</span>
            </h2>

            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              {t("extra.instructor_cta_desc")}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center lg:justify-start">
              <Link
                href="/signup"
                onClick={() => trackEvent('instructor_cta_click', { type: 'become_instructor' })}
                className="group h-16 px-10 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:text-white hover:shadow-[0_20px_50px_-10px_rgba(var(--primary),0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                {t("extra.become_instructor")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/how-it-works"
                className="h-16 px-10 bg-card/80 border border-border text-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent hover:text-primary transition-all flex items-center justify-center"
              >
                {t("extra.learn_how_works")}
              </Link>
            </div>
          </div>

          {/* Right Side: Stats Cards - Using Theme Variables */}
          <div className="grid grid-cols-2 gap-5 w-full lg:w-auto">

            {/* Earnings Card */}
            <div className="p-8 bg-card/40 backdrop-blur-xl border border-primary/10 rounded-[2.5rem] flex flex-col gap-5 hover:border-primary/30 hover:bg-card hover:shadow-[0_20px_40px_-15px_rgba(var(--primary),0.1)] transition-all duration-500 group">
              <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                <Wallet className="w-7 h-7 text-primary group-hover:text-inherit" />
              </div>
              <div>
                <p className="text-foreground text-3xl font-black italic tracking-tighter">{t("info.avg_monthly_val")}</p>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">{t("info.avg_monthly")}</p>
              </div>
            </div>

            {/* Students Card */}
            <div className="p-8 bg-card/40 backdrop-blur-xl border border-primary/10 rounded-[2.5rem] flex flex-col gap-5 hover:border-primary/30 hover:bg-card hover:shadow-[0_20px_40px_-15px_rgba(var(--primary),0.1)] transition-all duration-500 group">
              <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                <Users className="w-7 h-7 text-primary group-hover:text-inherit" />
              </div>
              <div>
                <p className="text-foreground text-3xl font-black italic tracking-tighter">{t("info.students_val")}</p>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">{t("info.students")}</p>
              </div>
            </div>

            {/* Reach Card */}
            <div className="col-span-2 p-8 bg-card/40 backdrop-blur-xl border border-primary/10 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-primary/30 hover:bg-card hover:shadow-[0_20px_40px_-15px_rgba(var(--primary),0.1)] transition-all duration-500 group">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                  <Globe className="w-7 h-7 text-primary group-hover:text-inherit" />
                </div>
                <div>
                  <p className="text-foreground text-lg font-bold italic tracking-tight">{t("info.global_reach")}</p>
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{t("info.countries")}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-primary/10 pt-4 sm:pt-0 sm:pl-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-background shadow-sm hover:scale-110 hover:z-10 transition-transform overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 40}`} alt="user" />
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground text-[11px] font-bold leading-tight">{t("info.join_educators")}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Section>
  );
}