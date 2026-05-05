"use client"

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Inbox,
  Video
} from 'lucide-react'

export function InstructorAnalytics({ 
  courses = [], 
  statistics = {} 
}: { 
  courses?: any[], 
  statistics?: any 
}) {
  const { t } = useTranslation()

  // 📈 Revenue over top courses
  const revenueData = useMemo(() => {
    const sortedCourses = [...courses].sort((a, b) => 
        (b.price * (b._count?.enrolledUsers || 0)) - (a.price * (a._count?.enrolledUsers || 0))
    ).slice(0, 10);
    
    return sortedCourses.map(c => (c.price * (c._count?.enrolledUsers || 0)));
  }, [courses]);

  const handleExportCSV = () => {
    const headers = ["ID", "Course Title", "Price", "Students", "Total Revenue"];
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
    link.setAttribute("download", `instructor_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 border border-primary/10 p-8 rounded-[2.5rem]">
          <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <div>
                  <h4 className="text-lg font-black italic">Instructor Performance Center</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Comprehensive data on your curriculum and student engagement</p>
              </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
              <button onClick={handleExportCSV} className="flex-1 md:flex-none px-8 py-4 bg-card border border-border hover:border-primary/50 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Inbox className="w-4 h-4" /> Export Student Data
              </button>
              <button onClick={() => window.print()} className="flex-1 md:flex-none px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
                  <TrendingUp className="w-4 h-4" /> Performance Report
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Earnings Analysis */}
        <div className="bg-card border border-border/60 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h3 className="text-2xl font-black italic flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-emerald-500" />
                ${statistics.totalRevenue?.toLocaleString() || 0}
              </h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                Estimated Net Earnings
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{statistics.engagementRate || 0}% Engagement
            </div>
          </div>
          <div className="h-64 w-full relative">
            <AreaChart data={revenueData} color="#10b981" />
          </div>
          <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-border/40">
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Courses</p>
                <p className="text-xl font-black italic text-foreground">{statistics.totalCourses || 0}</p>
             </div>
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Unique Students</p>
                <p className="text-xl font-black italic text-foreground">{statistics.totalStudents || 0}</p>
             </div>
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Lessons</p>
                <p className="text-xl font-black italic text-primary">{statistics.totalLessons || 0}</p>
             </div>
          </div>
        </div>

        {/* Top Performing Courses */}
        <div className="bg-card border border-border/60 rounded-[3rem] p-10 shadow-2xl space-y-8">
            <div className="space-y-1">
                <h3 className="text-xl font-black italic flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Top Performing Courses
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Based on enrollment and revenue metrics</p>
            </div>
            
            <div className="space-y-5">
                {[...courses].sort((a,b) => (b.price * (b._count?.enrolledUsers || 0)) - (a.price * (a._count?.enrolledUsers || 0))).slice(0, 5).map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-secondary/20 rounded-3xl border border-border/40 hover:border-primary/30 transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black group-hover:scale-110 transition-transform">
                                {i === 0 ? <TrendingUp className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="text-sm font-black truncate max-w-[200px]">{c.title}</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{c._count?.enrolledUsers || 0} Students enrolled</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-black text-emerald-500">${(c.price * (c._count?.enrolledUsers || 0)).toLocaleString()}</p>
                            <p className="text-[9px] text-muted-foreground uppercase font-black">Gross Revenue</p>
                        </div>
                    </div>
                ))}
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
      <path d={pathData} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
