"use client"
import { useState, useMemo } from "react";
import { useGetInstructorAnalyticsQuery } from "@/redux/features/dashboard/dashboardApi"

import { useGetAllUsersQuery } from "@/redux/features/user/userApi"
import { Users, BookOpen, DollarSign, Loader2, TrendingUp, Inbox } from "lucide-react"
import { InstructorAnalytics } from "@/components/dashboard/InstructorAnalytics"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import DashboardHeader from "@/components/common/DashboardHeader";
import DashboardCard from "@/components/common/DashboardCard";
import DashboardFilterBar from "@/components/common/DashboardFilterBar";
import DataTable, { Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import { useGetInstructorAllCoursesQuery } from "@/redux/features/course/courseAPi";

export default function InstructorAnalyticsPage() {
  return <InstructorAnalyticsContent />
}

function InstructorAnalyticsContent() {
  const { user } = useSelector((state: RootState) => state.mentoroAuth);
  const { data: analyticsData, isLoading: analyticsLoading } = useGetInstructorAnalyticsQuery()
  const { data: coursesData, isLoading: coursesLoading } = useGetInstructorAllCoursesQuery({ limit: 100 })
  
  const stats = analyticsData?.data?.statistics || {}
  const courses = coursesData?.data?.courses || []

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const filteredCourses = useMemo(() => {
    return courses.filter((c: any) => c.title.toLowerCase().includes(search.toLowerCase()));
  }, [courses, search]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredCourses.slice(start, start + itemsPerPage);
  }, [filteredCourses, page]);

  if (analyticsLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const columns: Column<any>[] = [
    {
      header: "Course Identity",
      accessor: (course) => (
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
              <BookOpen className="w-5 h-5" />
           </div>
           <div>
              <p className="text-sm font-black text-foreground">{course.title}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{course.category?.name || "General"}</p>
           </div>
        </div>
      )
    },
    {
      header: "Enrollments",
      align: "center",
      accessor: (course) => (
        <div className="flex flex-col items-center">
            <span className="font-mono text-xs font-bold text-foreground">{course._count?.enrolledUsers || 0}</span>
            <span className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter">Students</span>
        </div>
      )
    },
    {
      header: "Engagement",
      align: "center",
      accessor: (course) => (
        <div className="flex items-center gap-2">
            <div className="h-1 w-16 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '65%' }}></div>
            </div>
            <span className="text-[10px] font-black text-emerald-500">65%</span>
        </div>
      )
    },
    {
      header: "Gross Revenue",
      align: "right",
      accessor: (course) => (
        <div className="text-right">
            <p className="text-base font-black text-foreground">${(course.price * (course._count?.enrolledUsers || 0)).toLocaleString()}</p>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Attributed</p>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      
      <DashboardHeader 
        badgeIcon={<TrendingUp className="w-4 h-4" />}
        badgeText="Performance Console"
        title="Instructor Analytics."
        subtitle="Evaluate your course success, student recruitment, and global impact across your intellectual property catalog."
        action={
            <div className="flex gap-4">
                 <div className="flex flex-col items-end px-6 py-4 bg-muted/50 rounded-3xl border border-border">
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">Global Reach</span>
                    <span className="text-2xl font-black text-foreground">{stats.totalStudents || 0} Students</span>
                 </div>
            </div>
        }
      />

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
          <InstructorAnalytics courses={courses} statistics={stats} />
      </div>

      <div className="space-y-8 pt-10 border-t border-border/50">
          <div className="flex items-center justify-between">
              <div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground italic">Course Breakdown</h2>
                  <p className="text-muted-foreground font-medium text-sm">Detailed performance metrics per curriculum asset.</p>
              </div>
          </div>

          <DashboardFilterBar 
            search={search}
            onSearchChange={(val) => { setSearch(val); setPage(1); }}
            searchPlaceholder="Search your analytics..."
          />

          <DashboardCard
            footer={
                totalPages > 1 && (
                    <Pagination 
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                )
            }
          >
            <DataTable
              columns={columns}
              data={paginatedCourses}
              loadingMessage="Calculating metrics..."
              emptyState={{
                title: "No Data Available.",
                description: "Start publishing courses to see performance insights.",
                icon: <BookOpen className="w-12 h-12" />
              }}
            />
          </DashboardCard>
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

