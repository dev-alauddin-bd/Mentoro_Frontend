"use client"

import React from 'react'
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Award,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react'

export function StudentAnalytics({ 
  statistics = {} 
}: { 
  statistics?: any 
}) {
  const completionRate = statistics.overallProgressVal || 0;

  return (
    <div className="space-y-12">
      {/* Header Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StudentStatCard 
            label="Enrolled Courses" 
            value={statistics.totalEnrolled || 0} 
            icon={<BookOpen className="w-6 h-6 text-blue-500" />}
            color="blue"
          />
          <StudentStatCard 
            label="Completed Courses" 
            value={statistics.completedCount || 0} 
            icon={<Award className="w-6 h-6 text-emerald-500" />}
            color="emerald"
          />
          <StudentStatCard 
            label="Lessons Completed" 
            value={statistics.lessonsCompleted || 0} 
            icon={<CheckCircle className="w-6 h-6 text-purple-500" />}
            color="purple"
          />
          <StudentStatCard 
            label="Pending Tasks" 
            value={statistics.pendingTasks || 0} 
            icon={<Clock className="w-6 h-6 text-rose-500" />}
            color="rose"
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Progress Overview */}
          <div className="bg-card border border-border/60 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-12">
                  <div className="space-y-1">
                      <h3 className="text-xl font-black italic flex items-center gap-3">
                          <Target className="w-6 h-6 text-primary" />
                          Learning Progress
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Success rate across all courses</p>
                  </div>
                  <div className="text-3xl font-black italic text-primary">{completionRate}%</div>
              </div>

              <div className="relative h-64 flex items-center justify-center">
                  <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          className="text-secondary"
                      />
                      <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="transparent"
                          strokeDasharray={552.92}
                          strokeDashoffset={552.92 - (552.92 * completionRate) / 100}
                          className="text-primary transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                      />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black italic tracking-tighter">{statistics.completedCount || 0}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Certified</span>
                  </div>
              </div>


              <div className="mt-12 p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-center gap-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                      <p className="text-sm font-black italic">Keep it up!</p>
                      <p className="text-xs text-muted-foreground">You are doing better than 75% of other students this month.</p>
                  </div>
              </div>
          </div>

          {/* Activity Breakdown */}
          <div className="bg-card border border-border/60 rounded-[3rem] p-10 shadow-2xl flex flex-col justify-between">
              <div className="space-y-8">
                  <div className="space-y-1">
                      <h3 className="text-xl font-black italic flex items-center gap-3">
                          <TrendingUp className="w-6 h-6 text-emerald-500" />
                          Activity Breakdown
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Visualizing your engagement metrics</p>
                  </div>

                  <div className="space-y-8">
                      <ProgressRow label="Curriculum Progress" value={completionRate} color="bg-emerald-500" />
                      <ProgressRow 
                        label="In Progress Courses" 
                        value={statistics.totalEnrolled > 0 ? Math.round((statistics.inProgressCount / statistics.totalEnrolled) * 100) : 0} 
                        color="bg-blue-500" 
                      />
                      <ProgressRow 
                        label="Lesson Completion" 
                        value={statistics.totalEnrolled > 0 ? Math.round((statistics.lessonsCompleted / (statistics.lessonsCompleted + statistics.pendingTasks || 1)) * 100) : 0} 
                        color="bg-purple-500" 
                      />
                  </div>

              </div>

              <button className="w-full py-5 bg-primary text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 mt-10">
                  Download Study Report
              </button>
          </div>
      </div>
    </div>
  )
}

function StudentStatCard({ label, value, icon, color }: any) {
    const bgColors: any = {
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        rose: "bg-rose-500/10 text-rose-500 border-rose-500/20"
    }

    return (
        <div className={`p-8 rounded-[2.5rem] border bg-card shadow-sm hover:translate-y-[-5px] transition-all duration-300 group`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${bgColors[color]} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
            <p className="text-3xl font-black text-foreground tabular-nums tracking-tighter">{value}</p>
        </div>
    )
}

function ProgressRow({ label, value, color }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-xs font-black uppercase tracking-widest opacity-80">{label}</span>
                <span className="text-sm font-black italic">{value}%</span>
            </div>
            <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                    className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    )
}
