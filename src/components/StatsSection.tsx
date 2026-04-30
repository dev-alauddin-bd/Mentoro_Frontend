"use client";

import { useTranslation } from "react-i18next";
import { Award, Users, BookOpen, Globe } from "lucide-react";

export function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    { 
        label: t("info.students") || "Students", 
        value: t("info.students_val") || "50k+", 
        icon: <Users className="w-6 h-6" /> 
    },
    { 
        label: t("nav.courses") || "Courses", 
        value: "1.2k+", 
        icon: <BookOpen className="w-6 h-6" /> 
    },
    { 
        label: t("nav.instructors") || "Instructors", 
        value: "450+", 
        icon: <Award className="w-6 h-6" /> 
    },
    { 
        label: t("info.global_reach") || "Countries Reached", 
        value: "120+", 
        icon: <Globe className="w-6 h-6" /> 
    },
  ];

  return (
    <section className="py-24 bg-secondary/20 relative overflow-hidden">

 <div className="container mx-auto space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-6 group relative z-10">
              <div className="w-20 h-20 bg-background border border-border/50 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:border-primary/20 group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-500">
                <div className="text-primary/80 group-hover:text-primary transition-colors">
                  {stat.icon}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-5xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300">{stat.value}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
