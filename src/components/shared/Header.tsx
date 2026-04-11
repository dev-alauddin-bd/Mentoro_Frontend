"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Globe, ChevronDown, Check, Menu, X } from "lucide-react";

import { RootState, AppDispatch } from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";
import { ThemeSwitcher } from "./ThemeSwitcher";

// --- Types & Constants ---
const languages = [
  { code: "en", name: "English" },
  { code: "bn", name: "বাংলা" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "ar", name: "العربية" },
];

// --- Sub-Component: LanguageSwitcher ---
function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    setIsOpen(false);
  };

  const currentLanguage = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 items-center gap-2 rounded-xl border border-border bg-background px-3 text-xs font-black transition-all hover:bg-secondary hover:border-primary/30 active:scale-95 shadow-sm"
      >
        <Globe className="h-3.5 w-3.5 text-primary" />
        <span className="uppercase tracking-tighter">{currentLanguage.code}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl border border-border bg-background p-1.5 shadow-xl animate-in fade-in zoom-in duration-200 z-[100]">
          <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
            Select Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-bold transition-colors ${
                i18n.language === lang.code
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang.name}
              {i18n.language === lang.code && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Main Component: Header ---
export function Header() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.cmAuth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-400 shadow-lg shadow-primary/25">
                <span className="text-xl font-black text-white italic">C</span>
              </div>
              <span className="hidden text-xl font-black tracking-tight text-foreground sm:inline-block">
                Course<span className="text-primary italic">Master</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 xl:flex px-2 py-1 bg-secondary/50 rounded-2xl border border-border/50">
              <NavLink href="/" label={t("nav.home")} />
              <NavLink href="/courses" label={t("nav.courses")} />
              <NavLink href="/about" label={t("nav.about") || "About"} />
              <NavLink href="/contact" label={t("nav.contact") || "Contact"} />
              {isAuthenticated && <NavLink href="/dashboard" label={t("nav.dashboard")} />}
              {isAuthenticated && user?.role === "admin" && <NavLink href="/admin" label={t("nav.admin")} />}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>

            <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />

            {/* User Interaction */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden flex-col items-end sm:flex">
                  <span className="text-xs font-black text-foreground leading-none">{user?.name}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">{user?.role}</span>
                </div>
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-sm flex items-center justify-center font-black text-sm uppercase">
                  {user?.name?.charAt(0)}
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex h-9 items-center justify-center rounded-xl bg-destructive/10 px-4 text-xs font-black text-destructive transition-all hover:bg-destructive hover:text-white"
                >
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="rounded-xl px-4 py-2 text-xs font-black text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.login")}
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:flex h-9 items-center justify-center rounded-xl bg-primary px-5 text-xs font-black text-white shadow-lg shadow-primary/25 hover:translate-y-[-2px] transition-all active:translate-y-0"
                >
                  {t("nav.signup")}
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground lg:hidden hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden animate-in slide-in-from-top-4 duration-200 border-t bg-background p-4 grid gap-2 shadow-xl">
          <MobileNavLink href="/" label={t("nav.home")} onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink href="/courses" label={t("nav.courses")} onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink href="/about" label={t("nav.about")} onClick={() => setIsMenuOpen(false)} />
          
          {isAuthenticated && (
            <>
              <div className="h-[1px] bg-border my-1" />
              <MobileNavLink href="/dashboard" label={t("nav.dashboard")} onClick={() => setIsMenuOpen(false)} />
              <button
                onClick={handleLogout}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-destructive py-3 text-sm font-black text-white"
              >
                {t("nav.logout")}
              </button>
            </>
          )}
          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex h-11 items-center justify-center rounded-xl bg-secondary text-sm font-black text-foreground">
                {t("nav.login")}
              </Link>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-black text-white">
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
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl px-4 py-2 text-xs font-black text-muted-foreground transition-all hover:bg-background hover:text-primary hover:shadow-sm"
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
