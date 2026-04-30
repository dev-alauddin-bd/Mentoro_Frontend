"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Globe, ChevronDown, Check, Menu, X, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

import { RootState, AppDispatch } from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";

// --- Types & Constants ---
const languages = [
  { code: "en", name: "English" },
  { code: "bn", name: "বাংলা" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "ar", name: "العربية" },
];

import { auth } from "@/lib/firebase";

// --- Main Component: Header ---
export function Header() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.cmAuth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const pathname = usePathname();

  const handleLogout = async () => {
    await auth.signOut();
    dispatch(logout());
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md transition-all duration-300 border-b border-border/40">

      {/* --- Top Layer: Secondary Info & Global Actions --- */}
      <div className="hidden border-b border-border/40 sm:block bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                {t("nav.about") || "About Us"}
              </Link>
              <Link href="/contact" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                {t("nav.contact") || "Support"}
              </Link>
             
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <div className="h-4 w-[1px] bg-border/60 mx-1" />
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Layer: Primary Branding & Navigation --- */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between gap-4">

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

          {/* 2. Main Navigation (Center - Desktop Only) */}
          <div className="hidden lg:flex flex-1 justify-center max-w-2xl">
            <nav className="flex items-center gap-2 p-2 bg-card/40 backdrop-blur-xl rounded-[1.5rem] border border-primary/10 shadow-sm px-6">
              <NavLink href="/" label={t("nav.home") || "Home"} active={pathname === "/"} />
              <NavLink href="/courses" label={t("nav.courses") || "Courses"} active={pathname === "/courses"} />
              <NavLink href="/about" label={t("nav.about") || "About Us"} active={pathname === "/about"} />
              <NavLink href="/contact" label={t("nav.contact") || "Contact"} active={pathname === "/contact"} />
              <NavLink href="/how-it-works" label={t("nav.how_it_works") || "How it works"} active={pathname === "/how-it-works"} />
            </nav>
          </div>

          {/* 3. User Actions (Right) */}
          <div className="flex items-center justify-end gap-3 ">
      
            {isAuthenticated ? (
              <div className="relative hidden lg:block" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-3 hover:opacity-80 transition-all"
                >
                  <div className="hidden flex-col items-end xl:flex text-right">
                    <span className="text-xs font-black text-foreground leading-none">{user?.name}</span>
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] leading-none mt-1.5 opacity-80">{user?.role}</span>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-card border border-primary/10 shadow-sm flex items-center justify-center font-black text-sm uppercase overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                    ) : (
                      user?.name?.charAt(0)
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-background border border-border rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 z-[100]">
                    <div className="p-4 border-b border-border/50 mb-2">
                      <p className="text-xs font-black text-foreground truncate">{user?.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate font-medium mt-1">{user?.email}</p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                      >
                        Dashboard
                      </Link>
                    
                    </div>

                    <div className="h-px bg-border/50 my-2 mx-2" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                    >
                      {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="flex h-11 items-center justify-center rounded-xl bg-card border border-primary/10 px-6 text-[10px] font-black uppercase tracking-widest text-foreground shadow-sm hover:bg-primary/5 hover:border-primary/30 hover:-translate-y-0.5 transition-all active:translate-y-0"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:flex h-11 items-center justify-center rounded-xl bg-primary px-7 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_12px_24px_-8px_rgba(var(--primary),0.4)] hover:shadow-primary/50 hover:-translate-y-0.5 transition-all active:translate-y-0"
                >
                  {t("nav.signup")}
                </Link>
              </div>
            )}

            {/* Mobile Actions Container */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="hidden lg:flex items-center gap-2">
                <ThemeSwitcher />
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-card border border-primary/10 text-foreground hover:text-primary transition-all active:scale-95 shadow-sm"
              >
                {isMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden animate-in slide-in-from-top-4 duration-200 border-t bg-background p-4 grid gap-2 shadow-2xl relative z-[60]">
          <MobileNavLink href="/" label={t("nav.home")} onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink href="/courses" label={t("nav.courses")} onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink href="/about" label={t("nav.about")} onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink href="/contact" label={t("nav.contact")} onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink href="/how-it-works" label={t("nav.platform_guide") || "Platform Guide"} onClick={() => setIsMenuOpen(false)} />

         

          <div className="flex items-center gap-3 p-2 mt-2 bg-secondary/50 rounded-2xl border border-border/50">
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t("nav.regional") || "Regional"}</span>
              <div className="mt-1">
                <LanguageSwitcher />
              </div>
            </div>
            <div className="h-10 w-px bg-border/60" />
            <div className="flex-1 flex flex-col items-end px-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2">{t("nav.display") || "Display"}</span>
              <div className="mt-1">
                <ThemeSwitcher />
              </div>
            </div>
          </div>

          {isAuthenticated ? (
            <>
              <div className="h-[1px] bg-border/60 my-2" />
              <MobileNavLink href="/dashboard" label={t("nav.dashboard")} onClick={() => setIsMenuOpen(false)} />
              <button
                onClick={handleLogout}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-destructive py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-destructive/20"
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-3">
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex h-12 items-center justify-center rounded-xl bg-secondary border border-border/50 text-[10px] font-black uppercase tracking-widest text-foreground">
                {t("nav.login")}
              </Link>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="flex h-12 items-center justify-center rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20">
                {t("nav.signup")}
              </Link>
            </div>
          )}
        </div>
      )}
      
    </header>
  );
}

// --- Helpers ---
function NavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${active
        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
        }`}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-black text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
    >
      {label}
    </Link>
  );
}
