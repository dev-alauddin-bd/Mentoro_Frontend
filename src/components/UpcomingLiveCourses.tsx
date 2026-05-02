"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { Star, Users, Clock, Video, Calendar, ArrowRight, Loader2 } from "lucide-react"
import { useGetAllSessionsQuery } from "@/redux/features/liveSession/liveSessionApi"
import { Section } from "./ui/section"

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference <= 0) {
        setTimeLeft(t("upcoming.started"))
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / (1000 * 60)) % 60)

      setTimeLeft(`${days > 0 ? days + "d " : ""}${hours}h ${minutes}m`)
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [targetDate])

  return <span>{timeLeft}</span>
}

export function UpcomingLiveCourses() {
  const { t } = useTranslation();
  const { data: response, isLoading } = useGetAllSessionsQuery({})
  const sessions = response?.data?.sessions || response?.data || []

  if (isLoading) {
    return (
      <div className="py-32 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Section className="from-transparent to-secondary/10" containerClassName="space-y-12 lg:space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 text-primary">
            <Video className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t("upcoming.badge")}</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
            {t("upcoming.title_start")} <span className="text-primary italic font-serif">{t("upcoming.title_end")}</span>
          </h2>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            {t("upcoming.description")}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sessions.slice(0, 4).map((session: any) => {
          const isDeadlinePassed = new Date() > new Date(session.registrationDeadline)

          return (
            <div
              key={session.id}
              className="group relative flex flex-col h-full bg-card rounded-[2rem] overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Thumbnail Area */}
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={session.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"}
                  alt={session.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute top-4 left-4 z-10">
                  <div className="px-3 py-1 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                    {t("upcoming.card_badge")}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 flex-grow flex flex-col">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      4.9
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] flex items-center">
                    {session.title}
                  </h3>

                  <p className="text-muted-foreground text-sm font-medium italic line-clamp-2 min-h-[2.5rem]">
                    {session.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-primary/10 rounded text-[10px] font-black uppercase tracking-widest text-primary">
                       {t("upcoming.card_type")}
                    </span>
                    <span className="text-[11px] font-bold text-muted-foreground">
                       • {session.instructor?.name || "Expert Instructor"}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">{t("upcoming.starts_in")}</span>
                    <div className="flex items-center gap-1.5 text-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-black"><CountdownTimer targetDate={new Date(session.sessionDate)} /></span>
                    </div>
                  </div>

                  {isDeadlinePassed ? (
                    <div className="px-4 py-2 bg-secondary rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-not-allowed">
                      {t("upcoming.closed")}
                    </div>
                  ) : (
                    <Link
                      href={`/live/${session.id}`}
                      className="px-4 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/10"
                    >
                      {t("upcoming.register")}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
