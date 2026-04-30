"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { Star, Users, Clock, Video, Calendar, ArrowRight, Loader2 } from "lucide-react"
import { useGetAllSessionsQuery } from "@/redux/features/liveSession/liveSessionApi"


function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference <= 0) {
        setTimeLeft("Started")
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
  const { data: response, isLoading } = useGetAllSessionsQuery({})
  const sessions = response?.data || []

  if (isLoading) {
    return (
      <div className="py-32 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section className="py-32 px-4 bg-background overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="space-y-20">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 text-primary">
                <Video className="w-4 h-4 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Real-time Learning</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9]">
                Live <span className="text-primary italic font-serif">Workshops.</span>
              </h2>
              <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                Experience high-fidelity interactive sessions with industry experts. No boring videos—just real conversations and live coding.
              </p>
            </div>

            <Link href="/live" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary hover:translate-x-2 transition-all">
              Explore All Sessions
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {sessions.map((session: any) => {
              const isDeadlinePassed = new Date() > new Date(session.registrationDeadline)
              
              return (
                <div 
                  key={session.id}
                  className="group bg-card border border-border rounded-[2.5rem] overflow-hidden flex flex-col hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5"
                >
                  {/* Thumbnail Area */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img 
                      src={session.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"} 
                      alt={session.title}
                      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <div className="px-4 py-1.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                         Upcoming
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6 flex-grow flex flex-col">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Workshop</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                           <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                           4.9
                        </div>
                      </div>
                      <h3 className="text-2xl font-black tracking-tight leading-none group-hover:text-primary transition-colors">
                        {session.title}
                      </h3>
                      <p className="text-muted-foreground text-sm font-medium italic line-clamp-2">{session.description}</p>
                    </div>

                    <div className="pt-6 border-t border-border/50 flex items-center justify-between mt-auto">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Starts in</p>
                        <div className="flex items-center gap-2 text-foreground">
                           <Clock className="w-4 h-4 text-primary" />
                           <span className="text-sm font-black"><CountdownTimer targetDate={new Date(session.sessionDate)} /></span>
                        </div>
                      </div>

                      {isDeadlinePassed ? (
                        <div className="px-4 py-2 bg-secondary rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-not-allowed">
                          Closed
                        </div>
                      ) : (
                        <Link 
                          href={`/live/${session.id}`}
                          className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/10"
                        >
                          Register
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
