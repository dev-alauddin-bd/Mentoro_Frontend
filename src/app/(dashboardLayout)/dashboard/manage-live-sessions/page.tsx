"use client"

import { useState } from "react"
import { 
  useGetAllSessionsQuery, 
  useDeleteSessionMutation,
  useGetRegistrantsQuery
} from "@/redux/features/liveSession/liveSessionApi"
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
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import toast from "react-hot-toast"
import { format } from "date-fns"

export default function LiveSessionManagement() {
  const { data: response, isLoading, refetch } = useGetAllSessionsQuery({})
  const [deleteSession] = useDeleteSessionMutation()
  const sessions = response?.data || []

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await deleteSession(id).unwrap()
        toast.success("Session deleted successfully")
        refetch()
      } catch (err) {
        toast.error("Failed to delete session")
      }
    }
  }

  return (
    <div className="p-6 lg:p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Live Session Management</h1>
          <p className="text-muted-foreground text-sm font-medium">Create and manage upcoming workshops and live events.</p>
        </div>
        <Button className="h-12 px-6 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Create New Session
        </Button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 rounded-2xl border-border/50 bg-secondary/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
               <Calendar className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Sessions</p>
               <p className="text-2xl font-black tracking-tight">{sessions.length}</p>
            </div>
         </Card>
         <Card className="p-6 rounded-2xl border-border/50 bg-secondary/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
               <Users className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Upcoming</p>
               <p className="text-2xl font-black tracking-tight">
                  {sessions.filter((s: any) => new Date(s.sessionDate) > new Date()).length}
               </p>
            </div>
         </Card>
         <Card className="p-6 rounded-2xl border-border/50 bg-secondary/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Registration Open</p>
               <p className="text-2xl font-black tracking-tight">
                  {sessions.filter((s: any) => new Date(s.registrationDeadline) > new Date()).length}
               </p>
            </div>
         </Card>
      </div>

      {/* Table Area */}
      <Card className="rounded-[2rem] border-border/50 overflow-hidden bg-card shadow-xl shadow-primary/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Session Info</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Schedule</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registration</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="space-y-2">
                       <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground/30" />
                       <p className="text-sm font-bold text-muted-foreground">No sessions found.</p>
                    </div>
                  </td>
                </tr>
              ) : sessions.map((session: any) => (
                <tr key={session.id} className="hover:bg-secondary/10 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden">
                          <img src={session.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&q=80"} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="font-black tracking-tight text-sm leading-none mb-1">{session.title}</p>
                          <p className="text-[10px] font-bold text-muted-foreground italic">ID: {session.id.slice(0, 8)}...</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1">
                       <p className="text-xs font-black tracking-tight">{format(new Date(session.sessionDate), "MMM dd, yyyy")}</p>
                       <p className="text-[10px] font-bold text-muted-foreground italic">{format(new Date(session.sessionDate), "hh:mm a")}</p>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1">
                       <p className="text-xs font-black tracking-tight">{format(new Date(session.registrationDeadline), "MMM dd, yyyy")}</p>
                       <p className="text-[10px] font-bold text-amber-500 italic">Deadline</p>
                    </div>
                  </td>
                  <td className="p-6">
                    {new Date(session.registrationDeadline) > new Date() ? (
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                    ) : (
                      <span className="px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">Expired</span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
