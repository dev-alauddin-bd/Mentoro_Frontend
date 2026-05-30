"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";
import { trackEvent } from "@/lib/gtag";

const languages = [
  { code: "en", name: "English" },
  { code: "bn", name: "বাংলা" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },

];

export function LanguageSwitcher() {
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
    // Update direction for RTL languages (Arabic and Urdu)
    document.documentElement.dir = (lng === "ar" || lng === "ur") ? "rtl" : "ltr";
    trackEvent('language_changed', { language_code: lng });
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
