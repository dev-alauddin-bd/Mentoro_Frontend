"use client";

import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { Section } from "./ui/section";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import emailjs from '@emailjs/browser';
import { trackEvent } from "@/lib/gtag";

export function ContactSection() {
  const { t } = useTranslation();

  const contactSchema = z.object({
    fullName: z.string().min(2, t("contact.validation.name_min") || "Name must be at least 2 characters"),
    email: z.string().email(t("contact.validation.email_invalid") || "Invalid email address"),
    subject: z.string().min(3, t("contact.validation.subject_min") || "Subject must be at least 3 characters"),
    message: z.string().min(10, t("contact.validation.message_min") || "Message must be at least 10 characters"),
  });

  type ContactFormValues = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    console.log("Submitting form:", data);
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

    console.log("EmailJS Keys check:", { serviceId: !!serviceId, templateId: !!templateId, publicKey: !!publicKey });

    try {
      trackEvent('contact_section_submit', { subject: data.subject });

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: data.fullName,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
        },
        publicKey
      );

      toast.success(t("contact.success_toast") || "Message sent successfully!");
      reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error(t("contact.error_toast") || "Failed to send message.");
    }
  };

  return (
    <Section className="bg-secondary/5 relative overflow-hidden">


      <div className="max-w-7xl mx-auto space-y-16 lg:space-y-24 relative z-10">

        {/* --- Header Section --- */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-xs font-black uppercase text-primary tracking-widest">
            <MessageSquare className="w-3 h-3 fill-primary" />
            {t("contact.badge") || "Direct Communication"}
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.95]">
            {t("contact.title") || "Let's Build Something Great Together."}
          </h2>
          <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto italic">
            {t("contact.subtitle") || "Whether you have a question about courses, pricing, or partnerships, our team is ready to help you scale your education business."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* --- Contact Info --- */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: <Mail />,
                  label: t("contact.email_label"),
                  value: "support@coursemaster.com",
                  sub: t("contact.email_sub")
                },
                {
                  icon: <Phone />,
                  label: t("contact.call_label"),
                  value: "+880 1700 000000",
                  sub: t("contact.call_sub")
                },
              ].map((item, idx) => (
                <div key={idx} className="p-8 bg-card/60 backdrop-blur-md border border-border rounded-[2.5rem] hover:border-primary/20 transition-all group">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-lg font-black text-foreground mb-1">{item.value}</p>
                  <p className="text-xs font-medium text-muted-foreground italic">{item.sub}</p>
                </div>
              ))}
            </div>

            <div className="p-8 bg-card/60 backdrop-blur-md border border-border rounded-[3rem] flex items-start gap-6 hover:border-primary/20 transition-all group">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-all">
                <MapPin />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t("contact.address_label")}</p>
                <p className="text-lg font-black text-foreground mb-1">Dhanmondi, Dhaka, Bangladesh</p>
                <p className="text-xs font-medium text-muted-foreground italic">Technology District, Zone 1209</p>
              </div>
            </div>
          </div>

          {/* --- Contact Form --- */}
          <div className="p-10 bg-card border border-border rounded-[3rem] shadow-xl shadow-primary/5 relative overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t("contact.form_name")}</label>
                  <input {...register("fullName")} type="text" placeholder="John Doe" className={`w-full h-14 px-6 bg-secondary/20 border rounded-2xl focus:outline-none focus:border-primary transition-all font-medium placeholder:opacity-30 ${errors.fullName ? "border-red-500/50" : "border-border"}`} />
                  {errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t("contact.form_email")}</label>
                  <input {...register("email")} type="email" placeholder="john@example.com" className={`w-full h-14 px-6 bg-secondary/20 border rounded-2xl focus:outline-none focus:border-primary transition-all font-medium placeholder:opacity-30 ${errors.email ? "border-red-500/50" : "border-border"}`} />
                  {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t("contact.form_subject")}</label>
                <input {...register("subject")} type="text" placeholder="Inquiry about instructor onboarding" className={`w-full h-14 px-6 bg-secondary/20 border rounded-2xl focus:outline-none focus:border-primary transition-all font-medium placeholder:opacity-30 ${errors.subject ? "border-red-500/50" : "border-border"}`} />
                {errors.subject && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t("contact.form_message")}</label>
                <textarea {...register("message")} rows={4} placeholder="Tell us more about your needs..." className={`w-full p-6 bg-secondary/20 border rounded-3xl focus:outline-none focus:border-primary transition-all font-medium resize-none placeholder:opacity-30 ${errors.message ? "border-red-500/50" : "border-border"}`}></textarea>
                {errors.message && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.message.message}</p>}
              </div>

              <button
                disabled={isSubmitting}
                className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Clock className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t("contact.form_submit")}
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </Section>
  );
}