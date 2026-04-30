"use client"

import { useState } from "react"
import { ChevronDown, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "How do I get started with CourseMaster?",
    answer: "Simply sign up for an account, browse our extensive library of courses, and enroll in the subjects that interest you. You can start learning immediately!"
  },
  {
    question: "Are the courses self-paced or live?",
    answer: "We offer both! Most courses are self-paced, allowing you to learn at your own speed. We also have live learning sessions and workshops with industry experts."
  },
  {
    question: "Do I get a certificate after completing a course?",
    answer: "Yes, upon successful completion of any course, you will receive a digital certificate that you can share on LinkedIn or with potential employers."
  },
  {
    question: "Can I become an instructor on CourseMaster?",
    answer: "Absolutely! If you're an expert in your field, you can apply to become an instructor through your dashboard and start sharing your knowledge with the world."
  },
  {
    question: "What is the refund policy?",
    answer: "We offer a 30-day money-back guarantee for most courses. If you're not satisfied with your purchase, you can request a refund within the first 30 days."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Common Questions</span>
            <h2 className="text-4xl font-black tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground font-medium">
              Everything you need to know about the platform and your learning journey.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={cn(
                  "border border-border rounded-[2rem] transition-all duration-300 overflow-hidden bg-card/30",
                  openIndex === index ? "border-primary/30 shadow-xl shadow-primary/5 bg-background" : "hover:border-primary/10"
                )}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 lg:p-8 text-left"
                >
                  <span className="text-lg font-bold pr-8">{faq.question}</span>
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all duration-500",
                    openIndex === index ? "bg-primary text-white border-primary rotate-180" : "bg-background"
                  )}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <div 
                  className={cn(
                    "grid transition-all duration-500 ease-in-out",
                    openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
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
