"use client";

import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  BarChart3,
  BookOpen,
  LayoutDashboard,
  Settings,
  LogOut,
  FolderKanban,
  Files,
  GraduationCap,
  History,
  ShieldCheck,
  Zap,
  Users,
  Video,
  Activity,
  Briefcase,
  ClipboardList,
  Sparkles,
  DollarSign,
  PlayCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { logout } from "@/redux/features/auth/authSlice";
import { useLogoutMutation } from "@/redux/features/auth/authApi";

// -------- MENU BY ROLE --------
export function AppSidebar() {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.mentoroAuth);
  const role = user?.role || "student";
  const dispatch = useDispatch();
  const pathname = usePathname();

  // -------- MENU BY ROLE --------
  const studentItems = [
    { title: t("nav.overview"), url: "/dashboard/student", icon: LayoutDashboard },
    { title: t("nav.my_courses"), url: "/dashboard/student/my-courses", icon: BookOpen },
    { title: t("nav.payments"), url: "/dashboard/student/payments", icon: History },
    { title: t("nav.analytics"), url: "/dashboard/student/analytics", icon: Activity },
    { title: t("nav.profile"), url: "/dashboard/settings", icon: Settings },
  ];


  const instructorItems = [
    { title: t("nav.overview"), url: "/dashboard/instructor", icon: BarChart3 },
    { title: t("nav.categories"), url: "/dashboard/instructor/manage-categories", icon: FolderKanban },
    { title: t("nav.manage_courses"), url: "/dashboard/instructor/manage-courses", icon: FolderKanban },
    { title: t("nav.curriculum"), url: "/dashboard/instructor/modules", icon: Files },
    { title: t("nav.lessons"), url: "/dashboard/instructor/lessons", icon: PlayCircle },
    { title: t("nav.revenue"), url: "/dashboard/instructor/revenue", icon: Zap },
    { title: t("nav.live_workshops"), url: "/dashboard/instructor/manage-live-sessions", icon: Video },
    { title: t("nav.assignments"), url: "/dashboard/instructor/assignments", icon: ClipboardList },
    { title: t("nav.analytics"), url: "/dashboard/instructor/analytics", icon: Activity },
    { title: t("nav.profile"), url: "/dashboard/settings", icon: Settings },
  ];

  const adminItems = [
    { title: t("nav.platform_hub"), url: "/dashboard/admin", icon: ShieldCheck },
    { title: t("nav.manage_users"), url: "/dashboard/admin/manage-users", icon: Users },
    { title: t("nav.manage_jobs"), url: "/dashboard/admin/manage-jobs", icon: Briefcase },
    { title: t("nav.revenue"), url: "/dashboard/admin/revenue", icon: BarChart3 },
    { title: t("nav.legal"), url: "/dashboard/admin/legal", icon: History },
    { title: t("nav.analytics"), url: "/dashboard/admin/analytics", icon: Activity },
    { title: t("nav.profile"), url: "/dashboard/settings", icon: Settings },
  ];


  const getMenuByRole = () => {
    switch (role) {
      case "admin": return [...adminItems];
      case "instructor": return [...instructorItems];
      case "student": return [...studentItems];
      default: return [...studentItems];
    }
  };

  const menuItems = getMenuByRole();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi(undefined).unwrap();
      dispatch(logout());
      window.location.href = "/";
    } catch (error) {
      dispatch(logout());
      window.location.href = "/";
    }
  };

  return (
    <Sidebar className="border-r border-border bg-background/95 backdrop-blur-xl md:bg-background/50">
      <SidebarContent className="flex flex-col h-full">

        <div className="pt-10 pb-6 flex justify-center">
          <Link href="/" className="group flex items-center transition-all duration-300">
            <img src="/logo.svg" alt="Mentoro" className="h-14 w-auto" />
          </Link>
        </div>

        {/* Separator */}
        <div className="px-6 mb-4">
          <div className="h-[1px] w-full bg-foreground/10"></div>
        </div>

        {/* --- NAVIGATION SECTION --- */}
        <div className="flex-1 px-4">
          <SidebarGroup>
            <div className="px-4 mb-2">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                {t("nav.console", { role: t(`user_management.roles.${role}`) })}
              </span>
            </div>

            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                          ${isActive
                              ? "bg-primary text-white shadow-lg shadow-primary/20 active:scale-95 translate-x-1"
                              : "hover:bg-secondary text-muted-foreground hover:text-foreground hover:translate-x-1"
                            }`}
                        >
                          <item.icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-primary/60"}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* --- USER & LOGOUT SECTION --- */}
        <div className="p-6 border-t border-border/50 bg-secondary/20">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm uppercase overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0)
              )}
            </div>
            <div className="flex flex-col truncate">
              <p className="text-[11px] font-black text-foreground truncate">{user?.name}</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group flex w-full items-center justify-center gap-2 h-12 rounded-xl bg-destructive/5 border border-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest transition-all hover:bg-destructive hover:text-white shadow-sm active:scale-95"
          >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Logout</span>
          </button>
        </div>

      </SidebarContent>
    </Sidebar>
  );
}
