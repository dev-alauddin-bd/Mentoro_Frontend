"use client"

import React, { useMemo } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  PieChart as PieChartIcon,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  Inbox
} from 'lucide-react'

export function AdminAnalytics({ 
  courses = [], 
  users = [], 
  statistics = {} 
}: { 
  courses?: any[], 
  users?: any[], 
  statistics?: any 
}) {
  const { t } = useTranslation()

  // 📈 Calculate Real Revenue Data from Courses
  const revenueData = useMemo(() => {
    const sortedCourses = [...courses].sort((a, b) => 
        (b.price * (b._count?.enrolledUsers || 0)) - (a.price * (a._count?.enrolledUsers || 0))
    ).slice(0, 12);
    
    return sortedCourses.map(c => (c.price * (c._count?.enrolledUsers || 0)));
  }, [courses]);

  // 📂 Calculate Real Course Distribution
  const courseDistribution = useMemo(() => {
    const categories: Record<string, { count: number, color: string }> = {};
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
    
    courses.forEach((c) => {
        const catName = c.category?.name || 'Uncategorized';
        if (!categories[catName]) {
            categories[catName] = { count: 0, color: colors[Object.keys(categories).length % colors.length] };
        }
        categories[catName].count++;
    });

    const total = courses.length || 1;
    return Object.entries(categories).map(([label, data]) => ({
        label,
        value: Math.round((data.count / total) * 100),
        color: data.color
    })).sort((a, b) => b.value - a.value).slice(0, 4);
  }, [courses]);

  const userList = useMemo(() => Array.isArray(users) ? users : [], [users]);

  const userTrends = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return {
            full: formatDate(d),
            label: days[d.getDay()]
        };
    }).reverse();

    const activityMap: Record<string, number> = {};
    last7Days.forEach(day => activityMap[day.full] = 0);

    userList.forEach(u => {
        const dateStr = u.createdAt || u.joinDate;
        if (!dateStr) return;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return;
        const date = formatDate(d);
        if (activityMap[date] !== undefined) {
            activityMap[date]++;
        }
    });

    return last7Days.map(day => ({
        label: day.label,
        value: activityMap[day.full]
    }));
  }, [userList]);

  const userActivity = useMemo(() => userTrends.map(t => t.value), [userTrends]);

  const activityStats = useMemo(() => {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
        newThisWeek: userList.filter(u => {
            const dateStr = u.createdAt || u.joinDate;
            if (!dateStr) return false;
            const d = new Date(dateStr);
            return !isNaN(d.getTime()) && d > lastWeek;
        }).length,
        newThisMonth: userList.filter(u => {
            const dateStr = u.createdAt || u.joinDate;
            if (!dateStr) return false;
            const d = new Date(dateStr);
            return !isNaN(d.getTime()) && d > lastMonth;
        }).length,
    }
  }, [userList]);

  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Price", "Enrollments", "Revenue"];
    const rows = courses.map(c => [
        c.id,
        `"${c.title}"`,
        c.price,
        c._count?.enrolledUsers || 0,
        c.price * (c._count?.enrolledUsers || 0)
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admin_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 print:p-0">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-secondary/30 border border-border/40 p-6 rounded-[2rem] no-print">
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                  <h4 className="text-sm font-black italic">{t("admin.analytics.export_center")}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{t("admin.analytics.data_aggregation")}</p>
              </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
              <button onClick={handleExportCSV} className="flex-1 md:flex-none px-6 py-3 bg-card border border-border/60 hover:border-primary/50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Inbox className="w-3.5 h-3.5" /> {t("admin.analytics.csv_export")}
              </button>
              <button onClick={() => window.print()} className="flex-1 md:flex-none px-6 py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
                  <TrendingUp className="w-3.5 h-3.5" /> {t("admin.analytics.pdf_report")}
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="bg-card border border-border/60 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h3 className="text-xl font-black italic flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                ${statistics.totalRevenue?.toLocaleString() || 0}
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                {t('admin.analytics.revenue_stream')}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
              <ArrowUpRight className="w-3 h-3" /> +{statistics.engagementRate || 0}%
            </div>
          </div>
          <div className="h-64 w-full relative">
            <AreaChart data={revenueData} color="#10b981" />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/40">
             <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{t("admin.analytics.growth")}</p>
                <p className="text-sm font-black italic">+{statistics.engagementRate || 0}%</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{t("admin.analytics.stats.courses")}</p>
                <p className="text-sm font-black italic">{statistics.totalCourses || 0}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{t("admin.analytics.avg_ltv")}</p>
                <p className="text-sm font-black italic">${statistics.totalStudents > 0 ? Math.round(statistics.totalRevenue / statistics.totalStudents) : 0}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{t("admin.analytics.status.active") || "Active"}</p>
                <p className="text-sm font-black italic text-emerald-500">{statistics.totalStudents || 0}</p>
             </div>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
           <div className="relative w-48 h-48 flex-shrink-0">
              <DonutChart data={courseDistribution} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black italic tracking-tighter text-foreground">{courses.length}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{t("admin.analytics.total_assets")}</span>
              </div>
           </div>
           <div className="flex-1 space-y-6 w-full">
              <div className="space-y-1 mb-8">
                 <h3 className="text-xl font-black italic flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-primary" />
                    {t('admin.course_categories')}
                 </h3>
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                    {t("admin.analytics.strategic_allocation")}
                 </p>
              </div>
              <div className="space-y-4">
                 {courseDistribution.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="opacity-60">{item.label}</span>
                          <span style={{ color: item.color }}>{item.value}%</span>
                       </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="bg-card border border-border/60 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group xl:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div className="space-y-1">
                    <h3 className="text-xl font-black italic flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        {t('admin.growth_trends')}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                        {t("admin.analytics.expansion_velocity")}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-secondary rounded-2xl flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{t("admin.analytics.new_week")}</span>
                        <span className="text-xl font-black tabular-nums tracking-tighter">+{activityStats.newThisWeek}</span>
                    </div>
                    <div className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl flex flex-col shadow-lg shadow-primary/20">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-80">{t("admin.analytics.new_month")}</span>
                        <span className="text-xl font-black tabular-nums tracking-tighter">+{activityStats.newThisMonth}</span>
                    </div>
                </div>
            </div>
            <div className="h-72 w-full relative">
                <BarChart data={userActivity} color="#3b82f6" labels={userTrends.map(t => t.label)} />
            </div>
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 bg-card border border-primary/20 rounded-[2rem] flex flex-col justify-between gap-8 shadow-xl relative overflow-hidden">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                            <Zap className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-black italic">{t('admin.insights')}</h4>
                             <p className="text-xs text-muted-foreground max-w-md">
                                <Trans i18nKey="admin.analytics.insights_desc" values={{ count: courses.length, category: courseDistribution[0]?.label || 'General', percent: courseDistribution[0]?.value || 0 }}>
                                    Based on your <span className="text-primary font-bold">0 courses</span>, the most successful category is <span className="text-primary font-bold">General</span> with <span className="text-primary font-bold">0%</span> market share.
                                </Trans>
                            </p>
                        </div>
                    </div>
                     <button className="w-full py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
                        {t("admin.analytics.view_full_report")}
                    </button>
                </div>

                <div className="p-8 bg-card border border-border rounded-[2rem] space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-l-2 border-primary pl-3">{t("admin.analytics.top_selling")}</h4>
                    <div className="space-y-4">
                        {[...courses].sort((a,b) => (b.price * (b._count?.enrolledUsers || 0)) - (a.price * (a._count?.enrolledUsers || 0))).slice(0, 3).map((c, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/40">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs">#{i+1}</div>
                                    <div>
                                        <p className="text-xs font-black truncate max-w-[150px]">{c.title}</p>
                                        <p className="text-[10px] text-muted-foreground">{c._count?.enrolledUsers || 0} {t("admin.analytics.enrollments")}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-emerald-500">${(c.price * (c._count?.enrolledUsers || 0)).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

function AreaChart({ data, color }: { data: number[], color: string }) {
  const points = useMemo(() => {
    const max = Math.max(...data, 1)
    const width = 1000
    const height = 400
    const step = width / Math.max(data.length - 1, 1)
    return data.map((val, i) => ({ x: i * step, y: height - (val / max) * height }))
  }, [data])

  const pathData = useMemo(() => {
    if (points.length === 0) return ''
    const first = points[0]
    let path = `M ${first.x} ${first.y}`
    for (let i = 1; i < points.length; i++) {
      const curr = points[i]; const prev = points[i - 1]
      const cp1x = prev.x + (curr.x - prev.x) / 2
      const cp2x = prev.x + (curr.x - prev.x) / 2
      path += ` C ${cp1x} ${prev.y} ${cp2x} ${curr.y} ${curr.x} ${curr.y}`
    }
    return path
  }, [points])

  const areaData = useMemo(() => {
    if (points.length === 0) return ''
    const last = points[points.length - 1]; const first = points[0]
    return `${pathData} L ${last.x} 400 L ${first.x} 400 Z`
  }, [pathData, points])

  return (
    <svg viewBox="0 0 1000 400" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaData} fill="url(#areaGradient)" />
      <path d={pathData} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="animate-draw" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="8" fill="white" stroke={color} strokeWidth="4" className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer shadow-lg" />
      ))}
    </svg>
  )
}

function DonutChart({ data }: { data: any[] }) {
  let currentAngle = -90
  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
      {data.map((item, i) => {
        const angle = (item.value / total) * 360
        const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180)
        const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180)
        currentAngle += angle
        const x2 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180)
        const y2 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180)
        const largeArcFlag = angle > 180 ? 1 : 0
        const path = `M ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`
        return <path key={i} d={path} fill="none" stroke={item.color} strokeWidth="12" strokeLinecap="round" className="transition-all duration-500 hover:opacity-80 cursor-pointer" />
      })}
    </svg>
  )
}

function BarChart({ data, color, labels = [] }: { data: number[], color: string, labels?: string[] }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end justify-between h-full w-full gap-4 md:gap-8">
      {data.map((val, i) => (
        <div key={i} className="flex-1 h-full group relative flex flex-col justify-end items-center">
          <div className="w-full bg-primary/20 rounded-2xl transition-all duration-500 group-hover:bg-primary group-hover:scale-105 cursor-pointer relative" style={{ height: `${(val / max) * 100}%` }}>
             <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg border border-white/10 shadow-xl whitespace-nowrap">
                {val >= 1000 ? `${(val/1000).toFixed(1)}k` : val} Users
             </div>
          </div>
          <span className="text-[9px] font-black text-muted-foreground mt-4 opacity-40">{labels?.[i] || `Day ${i+1}`}</span>
        </div>
      ))}
    </div>
  )
}
