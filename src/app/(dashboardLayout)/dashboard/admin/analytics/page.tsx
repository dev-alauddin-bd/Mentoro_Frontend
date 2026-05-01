"use client"

import { useGetDashboardAnalyticsQuery } from "@/redux/features/dashboard/dashboardApi"
import { useGetAllCoursesQuery } from "@/redux/features/course/courseAPi"
import { useGetAllUsersQuery } from "@/redux/features/user/userApi"
import { Users, BookOpen, DollarSign, Loader2, TrendingUp, Inbox, ShieldCheck, UserCheck } from "lucide-react"
import { useTranslation } from "react-i18next"
import { PlatformAnalytics } from "@/components/dashboard/PlatformAnalytics"
import { RoleProtectedRoute } from "@/components/shared/RoleProtectedRoute"
import { Role } from "@/interfaces/user.interface"

export default function AdminAnalyticsPage() {
  return (
    <RoleProtectedRoute allowedRoles={[Role.admin]}>
      <AdminAnalyticsContent />
    </RoleProtectedRoute>
  )
}

function AdminAnalyticsContent() {
  const { t } = useTranslation()
  const { data: analyticsData, isLoading: analyticsLoading } = useGetDashboardAnalyticsQuery()
  const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery({ limit: 1000 })
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({ limit: 1000 })
  
  const stats = analyticsData?.data?.statistics || {}
  const courses = coursesData?.data?.courses || []
  const users = usersData?.data?.users || []

  if (analyticsLoading || coursesLoading || usersLoading) {
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
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-600/10 text-blue-600 rounded-full border border-blue-600/20 text-xs font-black uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" /> {t('admin.analytics.subtitle')}
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-foreground leading-tight">
                {t('admin.analytics.title')}
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl font-serif">
                Comprehensive data aggregation across <span className="text-primary font-bold">{stats.totalStudents || 0} users</span> and <span className="text-primary font-bold">{stats.totalCourses || 0} courses</span>.
            </p>
        </div>
        
        <div className="flex flex-wrap gap-4 relative z-10">
            <div className="px-8 py-5 bg-primary text-primary-foreground rounded-[2rem] shadow-xl shadow-primary/30 flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer">
                <span className="text-3xl font-black tabular-nums">{stats.engagementRate || 0}%</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{t('admin.analytics.engagement')}</span>
            </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <AdminMiniStats label={t('admin.analytics.stats.students')} value={stats.totalStudents || 0} icon={<Users />} color="text-blue-500" bg="bg-blue-500/5" />
        <AdminMiniStats label={t('admin.analytics.stats.instructors')} value={stats.totalInstructors || 0} icon={<UserCheck />} color="text-purple-500" bg="bg-purple-500/5" />
        <AdminMiniStats label={t('admin.analytics.stats.courses')} value={stats.totalCourses || 0} icon={<BookOpen />} color="text-green-500" bg="bg-green-500/5" />
        <AdminMiniStats label={t('admin.analytics.stats.enrollments')} value={stats.totalEnrollments || 0} icon={<Inbox />} color="text-orange-500" bg="bg-orange-500/5" />
        <AdminMiniStats label={t('admin.analytics.stats.revenue')} value={`$${(stats.totalRevenue || 0).toLocaleString()}`} icon={<DollarSign />} color="text-emerald-500" bg="bg-emerald-500/5" />
        <AdminMiniStats label={t('admin.analytics.stats.growth')} value="+12%" icon={<TrendingUp />} color="text-rose-500" bg="bg-rose-500/5" />
      </div>

      {/* Revenue & Distribution */}
      <div className="space-y-12">
        <div className="flex items-center justify-between">
           <h2 className="text-3xl font-black italic tracking-tighter text-foreground">{t('admin.analytics.advanced_metrics')}</h2>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              {t('admin.data_sync')}
           </div>
        </div>
        <PlatformAnalytics courses={courses} users={users} statistics={stats} />
      </div>
    
    </div>
  )
}

function AdminMiniStats({ label, value, icon, color, bg }: any) {
    return (
        <div className={`p-8 rounded-[2rem] border border-border bg-card shadow-sm hover:translate-y-[-5px] transition-all duration-300 group`}>
            <div className={`${bg} ${color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{label}</p>
            <p className="text-2xl font-black text-foreground tabular-nums tracking-tighter">{value}</p>
        </div>
    )
}

function ProgressItem({ label, value, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest opacity-60">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
                  style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    )
}
