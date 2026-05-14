"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import emailjs from '@emailjs/browser';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Globe,
  Sparkles,
  Clock,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import { trackEvent } from "@/lib/gtag"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function ContactPage() {
  const { t } = useTranslation();
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // --- Dynamic Validation Schema ---
  const contactSchema = z.object({
    fullName: z.string().min(2, t("contact.validation.name_min") || "Name must be at least 2 characters"),
    email: z.string().email(t("contact.validation.email_invalid") || "Invalid email address"),
    subject: z.string().min(3, t("contact.validation.subject_min") || "Subject must be at least 3 characters"),
    message: z.string().min(10, t("contact.validation.message_min") || "Message must be at least 10 characters"),
  })

  type ContactFormValues = z.infer<typeof contactSchema>

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  useEffect(() => {
    setIsInView(true)
  }, [])

  const onSubmit = async (data: ContactFormValues) => {
    try {
      trackEvent('contact_page_submit', { subject: data.subject });
      
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

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

      toast.success(t("contact.success_toast") || "Message sent successfully!")
      reset()
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error(t("contact.error_toast") || "Failed to send message.")
    }
  }

  /* ================= MAP CONFIG ================= */
  const position: [number, number] = [22.701, 90.3535]; // Barishal

  return (
    <main className="min-h-screen pt-32 pb-16 md:pt-40 md:pb-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 space-y-24 md:space-y-32 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" /> {t("contact.badge")}
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
              {t("contact.title_start")} <br />
              <span className="text-primary italic font-serif">{t("contact.title_end")}</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
              {t("contact.subtitle")}
            </p>
          </div>

          {/* ================= MAP ================= */}
          <div className="relative group">
            <div className="relative h-[400px] w-full rounded-[3.5rem] overflow-hidden border-8 border-background shadow-2xl">
              <MapContainer
                center={position as any}
                zoom={11}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position}>
                  <Popup>📍 {t("contact.location")}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Contact Form */}
            <div className="bg-card border border-border rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-primary/5">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight">
                    {t("extra.send_message") || "Send a Message"}
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    {t("contact.sla_desc")}
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <input 
                      {...register("fullName")}
                      className={`w-full h-14 px-6 bg-secondary/30 border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold ${errors.fullName ? "border-red-500/50" : "border-border"}`} 
                      placeholder={t("extra.full_name")} 
                    />
                    {errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <input 
                      {...register("email")}
                      className={`w-full h-14 px-6 bg-secondary/30 border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold ${errors.email ? "border-red-500/50" : "border-border"}`} 
                      placeholder={t("extra.email_address")} 
                    />
                    {errors.email && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <input 
                      {...register("subject")}
                      className={`w-full h-14 px-6 bg-secondary/30 border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold ${errors.subject ? "border-red-500/50" : "border-border"}`} 
                      placeholder={t("extra.subject") || "Subject"} 
                    />
                    {errors.subject && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <textarea 
                      {...register("message")}
                      className={`w-full px-6 py-4 bg-secondary/30 border rounded-[2rem] focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold resize-none ${errors.message ? "border-red-500/50" : "border-border"}`} 
                      rows={5} 
                      placeholder={t("extra.your_message")} 
                    />
                    {errors.message && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.message.message}</p>}
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full h-16 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-black uppercase tracking-widest text-sm"
                  >
                    {isSubmitting ? (
                      <Clock className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> {t("extra.submit")}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-12 lg:pl-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ContactInfoCard
                  icon={<Mail className="w-6 h-6" />}
                  title={t("contact.email_us")}
                  value="support@Mentoro.com"
                  subtitle={t("contact.official_support")}
                />

                <ContactInfoCard
                  icon={<Headphones className="w-6 h-6" />}
                  title={t("contact.live_support")}
                  value="+880 1234 567890"
                  subtitle={t("contact.mon_fri")}
                />

                <ContactInfoCard
                  icon={<MapPin className="w-6 h-6" />}
                  title={t("contact.our_studio")}
                  value={t("contact.location")}
                  subtitle={t("contact.address")}
                />

                <ContactInfoCard
                  icon={<Globe className="w-6 h-6" />}
                  title={t("contact.socials")}
                  value="@MentoroHQ"
                  subtitle={t("contact.social_platforms")}
                />
              </div>

              {/* SLA / Trust Card */}
              <div className="bg-card border border-border rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-primary/30 transition-all duration-500 shadow-sm">
                  <div className="relative z-10 space-y-6">
                    <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Clock className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-xl font-black tracking-tight text-foreground italic">{t("contact.rapid_response")}</h4>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                          {t("contact.sla_desc")}
                        </p>
                    </div>
                  </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function ContactInfoCard({ icon, title, value, subtitle }: any) {
  return (
    <div className="p-7 bg-card border border-border rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
      <div className="flex flex-col gap-5 relative z-10">
        <div className="w-14 h-14 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
          {icon}
        </div>
        <div className="space-y-1">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/70">{title}</h4>
          <p className="text-base font-black text-foreground tracking-tight break-words">{value}</p>
          <p className="text-[10px] font-bold text-muted-foreground/60">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
