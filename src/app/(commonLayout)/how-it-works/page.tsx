"use client"

import { useTranslation } from "react-i18next"
import Link from "next/link"
import { 
  Rocket, 
  BookOpen, 
  Users, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react"

export default function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Create Your Course",
      desc: "Upload your videos, documents, and quizzes. Our intuitive builder helps you structure your curriculum in minutes.",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Set Your Pricing",
      desc: "Choose between one-time purchases, subscriptions, or tiered access. You have full control over your revenue.",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Launch to the World",
      desc: "Publish your academy with your own branding. Reach students across 190+ countries instantly.",
      color: "bg-emerald-500/10 text-emerald-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Scale with Data",
      desc: "Use advanced analytics to track student progress, engagement, and sales. Optimize for maximum growth.",
      color: "bg-amber-500/10 text-amber-500"
    }
  ]

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        
        {/* --- Header Section --- */}
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("nav.how_it_works_subtitle")}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-tight">
            {t("how_it_works.title")} <br />
            <span className="text-muted-foreground italic font-serif">{t("nav.how_it_works_step")}</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            {t("how_it_works.subtitle")}
          </p>
        </div>

        {/* --- Steps Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {steps.map((step, index) => (
            <div key={index} className="relative group p-8 bg-card border border-border rounded-[2rem] hover:border-primary/50 transition-all duration-500">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center font-black text-sm text-muted-foreground group-hover:text-primary transition-colors">
                0{index + 1}
              </div>
              <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-black text-foreground mb-4">{t(`how_it_works.step${index + 1}_title`)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`how_it_works.step${index + 1}_desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* --- Deep Feature Section --- */}
        <div className="bg-card border border-border rounded-[3rem] overflow-hidden p-8 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
                Engineered for <br/> <span className="text-primary">Modern Education</span>
              </h2>
              <div className="space-y-6">
                {[
                  { t: "White-label Branding", d: "Your logo, your colors, your domain. It's your academy.", i: <ShieldCheck className="text-primary"/> },
                  { t: "Seamless Payments", d: "Integrate with Stripe, PayPal, and more for instant payouts.", i: <CheckCircle2 className="text-primary"/> },
                  { t: "Student Community", d: "Build engaged communities with built-in discussion forums.", i: <Users className="text-primary"/> }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">{feature.i}</div>
                    <div>
                      <h4 className="font-bold text-foreground">{feature.t}</h4>
                      <p className="text-sm text-muted-foreground">{feature.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Element: Mockup Style */}
            <div className="relative">
              <div className="relative aspect-video bg-background border border-border rounded-2xl shadow-2xl overflow-hidden group">
                 <div className="h-8 bg-muted border-b border-border flex items-center px-4 gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/30" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/30" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
                 </div>
                 <div className="p-8 flex items-center justify-center h-full">
                    <div className="space-y-4 w-full">
                       <div className="h-4 bg-muted rounded-full w-3/4 animate-pulse" />
                       <div className="h-4 bg-muted rounded-full w-1/2 animate-pulse" />
                       <div className="h-24 bg-primary/5 border border-primary/20 rounded-xl border-dashed flex items-center justify-center">
                          <p className="text-[10px] font-bold text-primary tracking-widest uppercase">Drag & Drop Builder</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Final CTA --- */}
        <div className="mt-32 text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Ready to start <span className="italic text-primary">teaching?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="h-16 px-10 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:shadow-[0_20px_50px_rgba(var(--primary),0.3)] transition-all">
              Launch Your Course
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="h-16 px-10 border-2 border-border bg-background text-foreground rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center hover:bg-secondary transition-all">
              Contact Sales
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}