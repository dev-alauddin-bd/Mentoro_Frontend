"use client"

import { useGetDashboardAnalyticsQuery } from "@/redux/features/dashboard/dashboardApi"
import { useGetAllCoursesQuery } from "@/redux/features/course/courseAPi"
import { useGetAllUsersQuery } from "@/redux/features/user/userApi"
import { Users, BookOpen, DollarSign, Loader2, TrendingUp, Inbox } from "lucide-react"
import { PlatformAnalytics } from "@/components/dashboard/PlatformAnalytics"
import { RoleProtectedRoute } from "@/components/shared/RoleProtectedRoute"
import { Role } from "@/interfaces/user.interface"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

export default function InstructorAnalyticsPage() {
  return (
    <RoleProtectedRoute allowedRoles={[Role.instructor, Role.admin]}>
      <InstructorAnalyticsContent />
    </RoleProtectedRoute>
  )
}

function InstructorAnalyticsContent() {
  const { user } = useSelector((state: RootState) => state.cmAuth);
  const { data: analyticsData, isLoading: analyticsLoading } = useGetDashboardAnalyticsQuery()
  const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery({ limit: 1000, instructorId: user?.id })
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery()
  
  const stats = analyticsData?.data?.statistics || {}
  const courses = coursesData?.data?.courses || []
  const users = usersData?.data?.users || usersData?.data || []

  if (analyticsLoading || coursesLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 rounded-full border border-primary/20 text-xs font-black uppercase tracking-[0.2em] text-primary">
                Instructor Console
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground leading-[1.1]">
                Performance Insights
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl font-medium">Evaluate your course success, students recruitment, and revenue streams.</p>
        </div>
        
        <div className="flex gap-4">
             <div className="flex flex-col items-end px-6 py-4 bg-muted/50 rounded-3xl border border-border">
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">Monthly Active Students</span>
                <span className="text-2xl font-black text-foreground">1,245 +</span>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsTile
          label="Total Courses"
          value={stats.totalCourses || 0}
          icon={<BookOpen className="w-6 h-6 text-emerald-500" />}
          gradient="from-emerald-500/10 to-emerald-600/10"
        />
        <StatsTile
          label="Total Students"
          value={stats.totalStudents || 0}
          icon={<Users className="w-6 h-6 text-purple-500" />}
          gradient="from-purple-500/10 to-purple-600/10"
        />
        <StatsTile
          label="Enrollments"
          value={stats.totalEnrollments || 0}
          icon={<Inbox className="w-6 h-6 text-orange-500" />}
          gradient="from-orange-500/10 to-orange-600/10"
        />
        <StatsTile
          label="Estimated Revenue"
          value={`$${stats.totalRevenue?.toLocaleString() || 0}`}
          icon={<DollarSign className="w-6 h-6 text-blue-500" />}
          gradient="from-blue-500/10 to-blue-600/10"
        />
      </div>

      <div className="space-y-10">
          <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black italic tracking-tighter text-foreground">Curriculum Insights</h2>
          </div>
          <PlatformAnalytics courses={courses} users={users} statistics={stats} />
      </div>
    </div>
  )
}

function StatsTile({ label, value, icon, gradient }: any) {
  return (
    <div className={`p-8 rounded-[2.5rem] border border-border bg-gradient-to-br ${gradient} hover:shadow-2xl transition-all duration-300 relative group overflow-hidden`}>
      <div className="flex flex-col gap-6">
        <div className="w-14 h-14 rounded-3xl bg-background flex items-center justify-center shadow-lg border border-border group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest border-l-2 border-primary pl-3 mb-2">{label}</p>
          <p className="text-3xl font-black text-foreground tabular-nums tracking-tighter">{value}</p>
        </div>
      </div>
      <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-white/20 blur-2xl rounded-full"></div>
    </div>
  )
}
