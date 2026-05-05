"use client"

import { useMemo } from "react"
import { Users, BookOpen, TrendingUp, DollarSign, Loader2, Sparkles } from "lucide-react"
import { useGetAdminAnalyticsQuery } from "@/redux/features/dashboard/dashboardApi"
import { DashboardStatCard } from "./dashboard/stat-card"
import { StatCardSkeleton } from "./dashboard/skeletons"

import { useTranslation } from "react-i18next"

export function AdminStats() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetAdminAnalyticsQuery();
  const stats = useMemo(() => data?.data?.statistics || {}, [data]);


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(idx => (
          <StatCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label={t("admin.analytics.stats.students")}
        value={stats.totalStudents || 0}
        icon={<Users className="w-5 h-5" />}
        trend={t("user_management.active_users")}
        variant="indigo"
      />
      <DashboardStatCard
        label={t("admin.analytics.stats.courses")}
        value={stats.totalCourses || 0}
        icon={<BookOpen className="w-5 h-5" />}
        trend={t("instructor.knowledge_assets")}
        variant="primary"
      />
      <DashboardStatCard
        label={t("admin.analytics.stats.revenue")}
        value={`$${stats.totalRevenue?.toLocaleString() || 0}`}
        icon={<DollarSign className="w-5 h-5" />}
        trend={t("instructor.platform_earnings")}
        variant="amber"
      />
      <DashboardStatCard
        label={t("admin.analytics.engagement")}
        value={`${stats.engagementRate || 0}%`}
        icon={<TrendingUp className="w-5 h-5" />}
        trend={t("admin.analytics.stats.growth")}
        variant="emerald"
      />
    </div>
  )
}
