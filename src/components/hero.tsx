"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { ArrowRight, Sparkles, Users, TrendingUp } from "lucide-react"

export function HeroAnimated() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsInView(true),
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    // min-h-screen ebong flex layout add kora hoyeche centering-er jonno
    <section ref={ref} className="relative min-h-[70vh] w-full overflow-hidden bg-background flex items-center pt-16 lg:pt-10">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* --- 2. LEFT SIDE: CONTENT --- */}
          <div className="space-y-10">
            <div className={`transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 hover:bg-primary/20 transition-all cursor-default group">
                <Sparkles className="w-3.5 h-3.5 text-primary group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  {t("hero.badge")}
                </span>
              </div>
            </div>

            <h1 className={`text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-foreground leading-[0.9] transition-all duration-1000 delay-100 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              {t("hero.title_start")} <br />
              <span className="text-primary italic font-serif leading-none">{t("hero.title_end")}</span>
            </h1>

            <p className={`text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed font-medium transition-all duration-1000 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              {t("hero.subtitle")}
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-5 transition-all duration-1000 delay-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
              <Link
                href="/courses"
                className="group h-16 px-10 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-sm hover:text-white hover:shadow-[0_20px_50px_-10px_rgba(var(--primary),0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                {t("hero.cta_start")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/how-it-works"
                className="h-16 px-10 bg-card/80 border text-foreground rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-accent hover:text-primary transition-all flex items-center justify-center"
              >
                {t("hero.cta_guide")}
              </Link>
            </div>
          </div>

          {/* --- 3. RIGHT SIDE: MOCKUP --- */}
          <div className={`relative transition-all duration-1000 delay-500 hidden lg:block ${isInView ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-20 scale-95"}`}>

            {/* The Main Browser Mockup */}
            <div className="relative z-20 mx-auto w-full max-w-[620px] aspect-[16/11] rounded-[2.5rem] border-[8px] border-card bg-card shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden">

              {/* Browser Bar */}
              <div className="h-12 bg-muted/50 border-b border-border flex items-center px-6 gap-2 shrink-0">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                </div>
              </div>

              {/* AUTO-SCROLLING AREA */}
              <div className="relative w-full h-full overflow-hidden bg-background">
                <div className="animate-auto-scroll w-full">
                  <img
                    src="/hero.jpg"
                    alt="SaaS Preview"
                    className="w-full h-auto object-top"
                  />
                  <img
                    src="/hero.jpg"
                    alt="SaaS Preview Repeat"
                    className="w-full h-auto object-top"
                  />
                </div>
              </div>
            </div>

            {/* FLOATING ELEMENTS */}
            <div className="absolute -top-10 -right-6 z-30 bg-card/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl animate-float group border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary border border-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
                  <TrendingUp className="w-6 h-6 text-primary group-hover:text-inherit" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("hero.growth")}</p>
                  <p className="text-2xl font-black text-foreground">+148%</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-6 z-30 bg-card/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl animate-float-delayed group border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary border border-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
                  <Users className="w-6 h-6 text-primary group-hover:text-inherit" />
                </div>
                <div>
                  <p className="text-2xl font-black text-foreground">2.4k</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t("hero.instructors")}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes auto-scroll {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-40%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(20px) rotate(-2deg); }
        }
        .animate-auto-scroll { animation: auto-scroll 20s ease-in-out infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
      `}</style>
    </section>
  );
}