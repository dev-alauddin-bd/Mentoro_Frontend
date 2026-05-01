"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { Section } from "./ui/section";

export function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: t("faq.q1"),
      answer: t("faq.a1"),
    },
    {
      question: t("faq.q2"),
      answer: t("faq.a2"),
    },
    {
      question: t("faq.q3"),
      answer: t("faq.a3"),
    },
    {
      question: t("faq.q4"),
      answer: t("faq.a4"),
    },
  ];

  return (
    <Section>
      <div className="max-w-4xl mx-auto space-y-16 lg:space-y-24">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-xs font-black uppercase text-primary tracking-widest">
            <HelpCircle className="w-3 h-3 fill-primary" />
            {t("faq.badge") || "Common Questions"}
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.95]">
            {t("faq.title") || "Everything you need to know."}
          </h2>
        </div>

        {/* Accordion Grid */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`group overflow-hidden rounded-[2rem] border transition-all duration-500 ${openIndex === idx
                  ? "bg-card border-primary/20 shadow-xl shadow-primary/5"
                  : "bg-background border-border/50 hover:border-primary/10"
                }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-8 py-8 flex items-center justify-between text-left"
              >
                <span className={`text-xl font-black tracking-tight transition-colors ${openIndex === idx ? "text-primary" : "text-foreground group-hover:text-primary"
                  }`}>
                  {faq.question}
                </span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 ${openIndex === idx
                    ? "bg-primary border-primary text-white rotate-180"
                    : "bg-background border-border text-muted-foreground group-hover:border-primary/30 group-hover:text-primary"
                  }`}>
                  {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>

              <div className={`transition-all duration-500 ease-in-out ${openIndex === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}>
                <div className="px-8 pb-8">
                  <div className="p-6 bg-secondary/50 rounded-2xl border border-border/50">
                    <p className="text-muted-foreground text-lg font-medium leading-relaxed italic">
                      &quot;{faq.answer}&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}