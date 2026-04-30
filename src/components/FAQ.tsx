"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

export function FAQ() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: t("faq.q1"),
      answer: t("faq.a1")
    },
    {
      question: t("faq.q2"),
      answer: t("faq.a2")
    },
    {
      question: t("faq.q3"),
      answer: t("faq.a3")
    },
    {
      question: t("faq.q4"),
      answer: t("faq.a4")
    },
    {
      question: t("faq.q5"),
      answer: t("faq.a5")
    }
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              {t("faq.badge")}
            </span>

            <h2 className="text-4xl font-black tracking-tight">
              {t("faq.title")}
            </h2>

            <p className="text-muted-foreground font-medium">
              {t("faq.subtitle")}
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={cn(
                  "border border-border rounded-[2rem] transition-all duration-300 overflow-hidden bg-card/30",
                  openIndex === index
                    ? "border-primary/30 shadow-xl shadow-primary/5 bg-background"
                    : "hover:border-primary/10"
                )}
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 lg:p-8 text-left"
                >
                  <span className="text-lg font-bold pr-8">
                    {faq.question}
                  </span>

                  <div
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all duration-500",
                      openIndex === index
                        ? "bg-primary text-white border-primary rotate-180"
                        : "bg-background"
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-500 ease-in-out",
                    openIndex === index
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 lg:p-8 pt-0 text-muted-foreground font-medium leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}