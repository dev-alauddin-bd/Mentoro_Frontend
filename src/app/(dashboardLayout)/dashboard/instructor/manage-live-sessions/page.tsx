"use client"

import { useState, useMemo } from "react"
import { 
  useGetAllSessionsQuery, 
  useDeleteSessionMutation,
  useGetRegistrantsQuery
} from "@/redux/features/liveSession/liveSessionApi"
import DashboardFilterBar from "@/components/common/DashboardFilterBar";
import { useTranslation } from "react-i18next"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Users, 
  Calendar, 
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Video
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import toast from "react-hot-toast"
import { format } from "date-fns"
import Pagination from "@/components/common/Pagination"


import { LiveSessionModal } from "@/components/live-session/LiveSessionModal"

import DashboardHeader from "@/components/common/DashboardHeader";
import DashboardCard from "@/components/common/DashboardCard";
import DataTable, { Column } from "@/components/common/DataTable";

export default function LiveSessionManagement() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const limit = 10;
  const { data: response, isLoading, refetch } = useGetAllSessionsQuery({ page, limit })
  const [deleteSession] = useDeleteSessionMutation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any>(null)

  const sessionsData = response?.data || []
  const totalPages = response?.meta?.totalPages || 0
  const totalSessions = response?.meta?.total || 0

  const [search, setSearch] = useState("")

  const filteredSessions = useMemo(() => {
    return sessionsData.filter((session: any) => 
        session.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [sessionsData, search]);

  const stats = {
    total: totalSessions,
    upcoming: sessionsData.filter((s: any) => new Date(s.sessionDate) > new Date()).length,
    registrationOpen: sessionsData.filter((s: any) => new Date(s.registrationDeadline) > new Date()).length
  }

  const handleDelete = async (id: string) => {
    if (window.confirm(t("live_sessions.modal.confirm_delete"))) {
      try {
        await deleteSession(id).unwrap()
        toast.success(t("live_sessions.modal.success_delete"))
        refetch()
      } catch (err) {
        toast.error(t("live_sessions.modal.error_delete"))
      }
    }
  }

  const handleCreate = () => {
    setSelectedSession(null)
    setIsModalOpen(true)
  }

  const handleEdit = (session: any) => {
    setSelectedSession(session)
    setIsModalOpen(true)
  }

  const columns: Column<any>[] = [
    {
      header: t("live_sessions.table.session_info"),
      accessor: (session) => (
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden">
              <img src={session.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&q=80"} className="w-full h-full object-cover" />
           </div>
           <div>
              <p className="font-black tracking-tight text-sm leading-none mb-1">{session.title}</p>
              <p className="text-[10px] font-bold text-muted-foreground italic">ID: {session.id.slice(0, 8)}...</p>
           </div>
        </div>
      )
    },
    {
      header: t("live_sessions.table.schedule"),
      accessor: (session) => (
        <div className="space-y-1">
           <p className="text-xs font-black tracking-tight">{format(new Date(session.sessionDate), "MMM dd, yyyy")}</p>
           <p className="text-[10px] font-bold text-muted-foreground italic">{format(new Date(session.sessionDate), "hh:mm a")}</p>
        </div>
      )
    },
    {
      header: t("live_sessions.table.registration"),
      accessor: (session) => (
        <div className="space-y-1">
           <p className="text-xs font-black tracking-tight">{format(new Date(session.registrationDeadline), "MMM dd, yyyy")}</p>
           <p className="text-[10px] font-bold text-amber-500 italic">{t("live_sessions.table.deadline")}</p>
        </div>
      )
    },
    {
      header: t("live_sessions.table.status"),
      accessor: (session) => (
        new Date(session.registrationDeadline) > new Date() ? (
          <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">{t("live_sessions.table.active")}</span>
        ) : (
          <span className="px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">{t("live_sessions.table.expired")}</span>
        )
      )
    },
    {
      header: t("live_sessions.table.actions"),
      align: "right",
      accessor: (session) => (
        <div className="flex items-center justify-end gap-2">
           <Button 
             onClick={() => handleEdit(session)}
             variant="ghost" 
             size="icon" 
             className="w-9 h-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
           >
              <Edit2 className="w-4 h-4" />
           </Button>
           <Button 
             onClick={() => handleDelete(session.id)}
             variant="ghost" 
             size="icon" 
             className="w-9 h-9 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
           >
              <Trash2 className="w-4 h-4" />
           </Button>
           <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-amber-500/10 hover:text-amber-500 transition-all">
              <Users className="w-4 h-4" />
           </Button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <DashboardHeader 
        badgeIcon={<Video className="w-3.5 h-3.5" />}
        badgeText="Broadcast Management"
        title={t("live_sessions.management_title")}
        subtitle={t("live_sessions.management_subtitle")}
        action={
          <Button 
            onClick={handleCreate}
            className="h-14 px-10 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            {t("live_sessions.create_new")}
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <StatsCard 
            icon={<Calendar className="w-6 h-6" />}
            label={t("live_sessions.stats.total")}
            value={totalSessions}
            variant="primary"
         />
         <StatsCard 
            icon={<Users className="w-6 h-6" />}
            label={t("live_sessions.stats.upcoming")}
            value={stats.upcoming}
            variant="amber"
         />
         <StatsCard 
            icon={<CheckCircle2 className="w-6 h-6" />}
            label={t("live_sessions.stats.registration_open")}
            value={stats.registrationOpen}
            variant="green"
         />
      </div>

      <DashboardFilterBar 
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder={t("live_sessions.search_placeholder")}
      />

      <DashboardCard
        header={
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Video className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-black italic">Live Ecosystem.</h3>
                    <p className="text-sm font-medium text-muted-foreground">Monitor and coordinate your upcoming academic broadcasts.</p>
                </div>
            </div>
        }
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
          data={filteredSessions}
          isLoading={isLoading}
          loadingMessage={t("live_sessions.table.loading")}
          emptyState={{
            title: t("live_sessions.table.no_sessions"),
            description: t("live_sessions.table.no_sessions_desc"),
            icon: <AlertCircle className="w-12 h-12" />
          }}
        />
      </DashboardCard>

      <LiveSessionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        session={selectedSession}
        onSuccess={() => refetch()}
      />
    </div>
  )
}

function StatsCard({ icon, label, value, variant = "primary" }: { icon: React.ReactNode, label: string, value: string | number, variant?: "primary" | "amber" | "green" }) {
  const variants = {
    primary: "from-primary/20 to-primary/5 text-primary border-primary/20 shadow-primary/5",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-500 border-amber-500/20 shadow-amber-50/5",
    green: "from-green-500/20 to-green-500/5 text-green-500 border-green-500/20 shadow-green-50/5"
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border bg-gradient-to-br ${variants[variant]} shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500`}>
       <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
       <div className="relative z-10 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
             {icon}
          </div>
          <div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">{label}</p>
             <p className="text-3xl font-black tracking-tighter italic tabular-nums">{value}</p>
          </div>
       </div>
    </div>
  );
}
