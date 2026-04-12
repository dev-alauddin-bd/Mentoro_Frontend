"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";

import {
  BarChart,
  Calendar,
  FileText,
  HelpCircle,
  Home,
  Inbox,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { logout } from "@/redux/features/auth/authSlice";

// -------- COMMON MENU FOR ALL ROLES --------
const commonItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

// -------- MENU BY ROLE --------
export const studentItems = [
  { title: "Overview", url: "/dashboard", icon: BarChart },
  { title: "My Courses", url: "/dashboard/student/my-courses", icon: Inbox },

];

export const instructorItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart },
  {
    title: "Manage Courses",
    url: "/dashboard/instructor/manage-courses",
    icon: Inbox,
  },
  {
    title: "Manage Modules",
    url: "/dashboard/instructor/modules",
    icon: FileText,
  },
  {
    title: "Manage Lessons",
    url: "/dashboard/instructor/lessons",
    icon: FileText,
  },
  {
    title: "Manage Assignments",
    url: "/dashboard/instructor/assignments",
    icon: FileText,
  },
  {
    title: "Analytics",
    url: "/dashboard/instructor/analytics",
    icon: BarChart,
  },
];

export const adminItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart },

  {
    title: "Manage Categories",
    url: "/dashboard/admin/manage-categories",
    icon: Calendar,
  },
  {
    title: "Site Analytics",
    url: "/dashboard/admin/analytics",
    icon: BarChart,
  },
  {
    title: "Payments & Revenue",
    url: "/dashboard/admin/payments",
    icon: Calendar, 
  },
  {
    title: "Refund Policy",
    url: "/dashboard/admin/refund-policy",
    icon: FileText,
  },
];


export function AppSidebar() {
  const { user } = useSelector((state: RootState) => state.cmAuth);
  const role = user?.role || "student";
  const dispatch = useDispatch();
  const pathname = usePathname(); // current path

 const getMenuByRole = () => {
  switch (role) {
    case "admin":
      return [...adminItems, ...commonItems];
    case "instructor":
      return [...instructorItems, ...commonItems];
    default:
      return [...studentItems, ...commonItems];
  }
};

  const menuItems = getMenuByRole();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full justify-between">
        {/* PROFILE + MENU */}
        <div>
          {/* PROFILE HEADER */}
          <div className="p-4 border-b flex items-center gap-3">
            <div>
              <p className="font-semibold text-sm">{user?.name || "User Name"}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>

          {/* Sidebar Group */}
          <SidebarGroup>
            <SidebarGroupLabel>
              {role === "admin"
                ? "Admin Panel"
                : role === "instructor"
                ? "Instructor Panel"
                : "Student Panel"}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className={`flex items-center gap-2 px-3 py-2 rounded transition
                          ${
                            isActive
                              ? "bg-primary text-white"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <item.icon className={isActive ? "text-white" : ""} />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Logout Button at Bottom */}
        <div className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-2 bg-red-500 text-white px-3 py-2 rounded cursor-pointer hover:bg-red-600 transition"
                >
                  <LogOut />
                  <span>Logout</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
