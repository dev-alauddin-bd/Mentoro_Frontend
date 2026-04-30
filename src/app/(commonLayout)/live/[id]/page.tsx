"use client"

import { useParams } from "next/navigation"
import { SessionRegistration } from "@/components/live-session/SessionRegistration"
import { ArrowLeft, Share2, Globe, ShieldCheck, Zap, Loader2 } from "lucide-react"
import Link from "next/link"
import { useGetSessionByIdQuery } from "@/redux/features/liveSession/liveSessionApi"

export default function SessionDetailsPage() {
  const params = useParams()
  const { data: response, isLoading } = useGetSessionByIdQuery(params.id as string)
  const session = response?.data

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <h2 className="text-4xl font-black italic">Session Not Found</h2>
        <Link href="/" className="text-primary font-bold hover:underline">Return Home</Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Content: Info */}
          <div className="lg:col-span-7 space-y-12">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                {session.title}
              </h1>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3 px-5 py-2.5 bg-secondary/50 rounded-2xl border border-border">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold">Online Workshop</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 bg-secondary/50 rounded-2xl border border-border">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold">Intermediate Level</span>
                </div>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                {session.description}
              </p>
            </div>

            <div className="pt-12 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  What you&apos;ll learn
                </h3>
                <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
                    Deep dive into modern architecture patterns.
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
                    Hands-on practical implementation steps.
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
                    Live Q&A session with the instructor.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  Share with friends
                </h3>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                  Knowledge is better when shared. Invite your colleagues to join this session.
                </p>
                <button 
                  onClick={() => {
                    const shareData = {
                      title: session.title,
                      text: session.description,
                      url: window.location.href,
                    }
                    if (navigator.share) {
                      navigator.share(shareData).catch(console.error)
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                      import("react-hot-toast").then(t => t.default.success("Link copied to clipboard!"))
                    }
                  }}
                  className="h-12 px-6 bg-secondary hover:bg-secondary/80 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Share Invitation Link
                </button>
              </div>
            </div>
          </div>

          {/* Right Content: Registration Form */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32">
              <SessionRegistration session={session} />
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
