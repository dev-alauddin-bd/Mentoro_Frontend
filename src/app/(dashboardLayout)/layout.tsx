"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { GlobalSearch } from "@/components/shared/GlobalSearch";

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

  // --- Breadcrumb Logic ---
  const paths = pathname.split("/").filter(Boolean);
  
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />

        <main className="flex-1 overflow-auto min-h-screen bg-secondary/30 relative">
          
       
          {/* ================= PREMIUM HEADER ================= */}
          <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur-3xl border-b border-border shadow-sm">
            <div className="flex h-20 items-center justify-between px-6 md:px-10">
              
              {/* Left Section: Sidebar Trigger & Breadcrumbs */}
              <div className="flex items-center gap-6">
                <SidebarTrigger className="h-11 w-11 rounded-2xl bg-card border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm" />
                
                <div className="h-8 w-px bg-border/60 mx-2 hidden md:block" />

                <nav className="hidden md:flex items-center gap-2">
                   <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10">
                         <LayoutDashboard className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">Dash</span>
                   </Link>
                   
                   {paths.slice(1).map((path, i) => (
                      <div key={path} className="flex items-center gap-2">
                         <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
                         <span className="text-xs font-black uppercase tracking-widest text-foreground/80 capitalize">
                            {path.replace(/-/g, " ")}
                         </span>
                      </div>
                   ))}
                </nav>
              </div>

               {/* Right Section: Actions & Settings */}
              <div className="flex items-center gap-4">
                 <GlobalSearch />
                 <div className="h-8 w-px bg-border/60 mx-2" />
                 <LanguageSwitcher />
                 <ThemeSwitcher />
              </div>
            </div>
          </header>

          {/* ================= CONTENT AREA ================= */}
          <div className="p-6 md:p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
             {children}
          </div>

        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}