"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCertificatePage = pathname.includes("/certificate/");

  if (isCertificatePage) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {children}
      </main>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex-1 overflow-auto min-h-screen bg-muted/20">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b bg-background/80 backdrop-blur-xl sticky top-0 z-20">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <SidebarTrigger />

            <div className="h-5 w-[1px] bg-border"></div>

            <div className="flex flex-col leading-tight">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Dashboard
              </span>
              <span className="text-sm font-bold text-foreground">
                Course Master
              </span>
            </div>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </SidebarProvider>
  );
}