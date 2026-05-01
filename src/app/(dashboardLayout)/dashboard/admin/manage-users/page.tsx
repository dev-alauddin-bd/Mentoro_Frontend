"use client";

import { useTranslation } from "react-i18next";
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  MoreVertical, 
  Loader2, 
  Mail, 
  Calendar, 
  BookOpen,
  GraduationCap,
  Shield,
  Search
} from "lucide-react";
import { 
  useGetAllUsersQuery, 
  useUpdateUserRoleMutation, 
  useUpdateUserStatusMutation 
} from "@/redux/features/user/userApi";
import { toast } from "react-hot-toast";
import { IUser, Role, UserStatus } from "@/interfaces/user.interface";
import { useState } from "react";

export default function ManageUsersPage() {
  const { t } = useTranslation();
  const { data: response, isLoading } = useGetAllUsersQuery();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
  const [searchQuery, setSearchQuery] = useState("");

  const users = response?.data?.users || response?.data || [];

  const filteredUsers = users.filter((user: IUser) => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateRole({ id: userId, role: newRole }).unwrap();
      toast.success(t("user_management.toasts.role_success"));
    } catch (err: any) {
      toast.error(err?.data?.message || t("user_management.toasts.error"));
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === UserStatus.active ? UserStatus.blocked : UserStatus.active;
    try {
      await updateStatus({ id: userId, status: newStatus }).unwrap();
      toast.success(t("user_management.toasts.status_success"));
    } catch (err: any) {
      toast.error(err?.data?.message || t("user_management.toasts.error"));
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10 max-w-7xl">
      
      {/* Header Branding */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                <Users className="w-3.5 h-3.5" /> {t("user_management.identity_hub")}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-tight italic">
                {t("user_management.title")}
            </h1>
            <p className="text-muted-foreground font-medium max-w-xl">
                {t("user_management.subtitle")}
            </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-card border border-border/60 rounded-2xl pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-card border border-border/60 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5">
          <div className="p-8 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight italic">{t("user_management.active_users")}</h3>
              <span className="px-3 py-1 bg-secondary rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">{filteredUsers.length} Total</span>
          </div>

          {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
                  <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing identities...</p>
              </div>
          ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                  <table className="w-full">
                      <thead>
                          <tr className="bg-muted/30">
                              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">{t("user_management.table.user_info")}</th>
                              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">{t("user_management.table.role")}</th>
                              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">{t("user_management.table.status")}</th>
                              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">{t("user_management.table.join_date")}</th>
                              <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">{t("user_management.table.courses")}</th>
                              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">{t("user_management.table.actions")}</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                          {filteredUsers.map((user: IUser) => (
                              <tr key={user.id} className="group hover:bg-muted/20 transition-colors">
                                  <td className="px-8 py-6">
                                      <div className="flex items-center gap-4">
                                           <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg uppercase shadow-sm">
                                              {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover rounded-2xl" />
                                              ) : (
                                                user.name.charAt(0)
                                              )}
                                           </div>
                                           <div>
                                              <p className="font-bold text-foreground text-sm">{user.name}</p>
                                              <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
                                                <Mail className="w-3 h-3" />
                                                {user.email}
                                              </div>
                                           </div>
                                      </div>
                                  </td>
                                  <td className="px-8 py-6">
                                      <select 
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="bg-secondary/50 border-none rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                      >
                                        <option value={Role.student}>{t("user_management.roles.student")}</option>
                                        <option value={Role.instructor}>{t("user_management.roles.instructor")}</option>
                                        <option value={Role.admin}>{t("user_management.roles.admin")}</option>
                                      </select>
                                  </td>
                                  <td className="px-8 py-6">
                                      <button
                                        onClick={() => handleStatusToggle(user.id, user.status)}
                                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border transition-all
                                          ${user.status === UserStatus.active 
                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white" 
                                            : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white"}`}
                                      >
                                        {user.status === UserStatus.active ? (
                                          <div className="flex items-center gap-1.5">
                                            <UserCheck className="w-3 h-3" />
                                            {t("user_management.status.active")}
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-1.5">
                                            <UserX className="w-3 h-3" />
                                            {t("user_management.status.blocked")}
                                          </div>
                                        )}
                                      </button>
                                  </td>
                                  <td className="px-8 py-6">
                                      <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5 text-primary/40" />
                                        {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "N/A"}
                                      </div>
                                  </td>
                                  <td className="px-8 py-6 text-center">
                                      <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-secondary text-foreground text-xs font-black">
                                        {user.courses || 0}
                                      </div>
                                  </td>
                                  <td className="px-8 py-6">
                                      <div className="flex items-center justify-end gap-2">
                                          <button className="h-9 w-9 bg-background border border-border/50 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm">
                                            <MoreVertical className="w-4 h-4" />
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          ) : (
              <div className="flex flex-col items-center justify-center py-40 text-center space-y-6">
                  <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center text-muted-foreground/20">
                      <Users className="w-12 h-12" />
                  </div>
                  <div className="space-y-1">
                      <h4 className="text-xl font-black italic">{t("user_management.table.no_users")}</h4>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}
