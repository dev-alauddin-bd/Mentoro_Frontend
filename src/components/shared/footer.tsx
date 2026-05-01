"use client";

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Facebook, Twitter, Linkedin, Youtube, Send } from "lucide-react"

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer-gradient relative overflow-hidden pt-20 lg:pt-32 pb-12 bg-card/30 shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.1)] border-t border-primary/5">


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-24 mb-24">
          
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
                 {/* 1. Logo Section (Left) */}
          <div className="flex-shrink-0">
            <Link href="/" className="group flex items-center gap-2.5 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary">
                <span className="text-2xl font-black text-white italic">C</span>
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="text-xl font-black tracking-tighter text-foreground leading-none">
                  Course
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 leading-none mt-1.5">Master</span>
              </div>
            </Link>
          </div>
                
                <p className="max-w-xs text-muted-foreground text-sm font-medium leading-relaxed">
                  {t("auth.create_account_desc")}
                </p>

                <div className="space-y-2 text-xs font-bold text-muted-foreground">
                  <p>Email: <a href="mailto:support@coursemaster.com" className="text-primary hover:underline">support@coursemaster.com</a></p>
                  <p>Location: Dhaka, Bangladesh</p>
                </div>
            </div>

            {/* Newsletter Input */}
            <div className="max-w-sm space-y-5">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t("footer.stay_in_orbit")}</p>
                <h3 className="text-lg font-black tracking-tight text-foreground">{t("footer.subscribe_newsletter")}</h3>
              </div>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder={t("footer.newsletter_placeholder")} 
                  className="w-full h-16 pl-6 pr-16 bg-background/50 border border-primary/10 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-background outline-none transition-all shadow-sm"
                />
                <button className="absolute right-2 top-2 h-12 w-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-primary/40 transition-all active:scale-95 group-hover:rotate-6">
                   <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <SocialIcon icon={<Facebook className="w-4 h-4" />} />
              <SocialIcon icon={<Twitter className="w-4 h-4" />} />
              <SocialIcon icon={<Linkedin className="w-4 h-4" />} />
              <SocialIcon icon={<Youtube className="w-4 h-4" />} />
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-6 pt-4">
            <FooterColumn title={t("footer.links")}>
                <li><Link href="/" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("nav.home")}</Link></li>
                <li><Link href="/courses" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("footer.explore")}</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("nav.about")}</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("nav.contact")}</Link></li>
                <li><Link href="/how-it-works" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("footer.learning_path")}</Link></li>
                <li><Link href="/careers" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("nav.careers")}</Link></li>
            </FooterColumn>

            <FooterColumn title={t("extra.for_instructors")}>
                <li><Link href="/signup" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("extra.become_instructor")}</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("nav.dashboard")}</Link></li>
                <li><Link href="/how-it-works" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("footer.platform_guide")}</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("footer.help")}</Link></li>
            </FooterColumn>

            <FooterColumn title={t("footer.legal")}>
                <li><Link href="/refund-policy" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("footer.refund_policy")}</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("footer.privacy")}</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("footer.terms")}</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-primary transition-all hover:translate-x-1.5 inline-block">{t("footer.cookie")}</Link></li>
            </FooterColumn>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="pt-10 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">
            © {new Date().getFullYear()} CourseMaster. {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">{t("footer.systems_active")}</span>
             </div>
             <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">
               {t("footer.handcrafted")}
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
    return (
        <a href="#" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 text-primary transition-all hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
            {icon}
        </a>
    )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">{title}</h4>
            <ul className="space-y-5 text-sm font-bold text-muted-foreground">
                {children}
            </ul>
        </div>
    )
}