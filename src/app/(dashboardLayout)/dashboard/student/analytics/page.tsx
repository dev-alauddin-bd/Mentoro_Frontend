"use client"

import { useGetStudentAnalyticsQuery } from "@/redux/features/dashboard/dashboardApi"
import { Loader2, ShieldCheck, Trophy, Target, Zap } from "lucide-react"
import { useTranslation } from "react-i18next"
import { StudentAnalytics } from "@/components/dashboard/StudentAnalytics"
import { RoleProtectedRoute } from "@/components/shared/RoleProtectedRoute"
import { Role } from "@/interfaces/user.interface"

export default function StudentAnalyticsPage() {
  return (
    <RoleProtectedRoute allowedRoles={[Role.student]}>
      <StudentAnalyticsContent />
    </RoleProtectedRoute>
  )
}

function StudentAnalyticsContent() {
  const { t } = useTranslation()
  const { data: analyticsData, isLoading: analyticsLoading } = useGetStudentAnalyticsQuery()
  
  const stats = analyticsData?.data?.statistics || {}

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header with platform status */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-border relative overflow-hidden group">
        <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-secondary text-foreground rounded-full border border-border text-xs font-black uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" /> Performance Dashboard
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-foreground leading-tight">
                Your Learning Journey
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl font-serif">
                Aggregated insights into your academic progress and <span className="text-primary font-bold">{stats.lessonsCompleted || 0} lessons</span> completed.
            </p>
        </div>
        
        <div className="flex flex-wrap gap-4 relative z-10">
            <div className="px-8 py-5 bg-primary text-primary-foreground rounded-[2rem] shadow-sm flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer">
                <span className="text-3xl font-black tabular-nums">{stats.completedCourses || 0}</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Courses Won</span>
            </div>
        </div>
      </div>

      <StudentAnalytics statistics={stats} />
    </div>
  )
}
