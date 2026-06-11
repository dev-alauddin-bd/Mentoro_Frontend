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
import Pagination from "@/components/common/Pagination";
import { useDebounce } from "use-debounce";
import DashboardHeader from "@/components/common/DashboardHeader";
import DashboardFilterBar from "@/components/common/DashboardFilterBar";
import DashboardCard from "@/components/common/DashboardCard";
import DataTable, { Column } from "@/components/common/DataTable";

export default function ManageUsersPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const { data: response, isLoading } = useGetAllUsersQuery({ 
    page, 
    limit, 
    search: debouncedSearch 
  });
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();

  const users = (response as any)?.data?.data?.users || (response as any)?.data?.users || [];

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

  const columns: Column<any>[] = [
    {
      header: t("user_management.table.user_info"),
      accessor: (user) => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg uppercase shadow-sm overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
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
      )
    },
    {
      header: t("user_management.table.role"),
      accessor: (user) => (
        <select 
          value={user.role}
          onChange={(e) => handleRoleChange(user.id, e.target.value)}
          className="bg-secondary/50 border-none rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
        >
          <option value={Role.student}>{t("user_management.roles.student")}</option>
          <option value={Role.instructor}>{t("user_management.roles.instructor")}</option>
          <option value={Role.admin}>{t("user_management.roles.admin")}</option>
        </select>
      )
    },
    {
      header: t("user_management.table.status"),
      accessor: (user) => (
        <button
          onClick={() => handleStatusToggle(user.id, user.status)}
          className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border transition-all cursor-pointer
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
      )
    },
    {
      header: t("user_management.table.join_date"),
      accessor: (user) => (
        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 text-primary/40" />
          {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "N/A"}
        </div>
      )
    },
    {
      header: t("user_management.table.courses"),
      align: "center",
      accessor: (user) => (
        <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-secondary text-foreground text-xs font-black">
          {user.courses || 0}
        </div>
      )
    },
    {
      header: t("user_management.table.actions"),
      align: "right",
      accessor: (user) => (
        <div className="flex items-center justify-end gap-2">
          <button className="h-9 w-9 bg-background border border-border/50 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10 max-w-7xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <DashboardHeader 
        badgeIcon={<Users className="w-3.5 h-3.5" />}
        badgeText={t("user_management.identity_hub")}
        title={t("user_management.title")}
        subtitle={t("user_management.subtitle")}
      />

      <DashboardFilterBar 
        search={searchQuery}
        onSearchChange={(val) => { setSearchQuery(val); setPage(1); }}
        searchPlaceholder="Search users..."
      />

      <DashboardCard
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black italic">{t("user_management.active_users")}</h3>
                <p className="text-sm font-medium text-muted-foreground">Coordinate roles and security parameters for registered users.</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-secondary rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {(response as any)?.data?.total || users.length} Total
            </span>
          </div>
        }
        footer={
          ((response as any)?.data?.data?.totalPages || (response as any)?.data?.totalPages || 0) > 1 && (
            <Pagination 
              currentPage={page}
              totalPages={(response as any)?.data?.data?.totalPages || (response as any)?.data?.totalPages || 0}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )
        }
      >
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          loadingMessage="Syncing identities..."
          emptyState={{
            title: t("user_management.table.no_users") || "No users found",
            description: "No users matching the search criteria.",
            icon: <Users className="w-12 h-12" />
          }}
        />
      </DashboardCard>
    </div>
  );
}
