"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useSelector(
    (state: RootState) => state.mentoroAuth
  );

  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wait until redux ready

    if (!user) {
      router.replace(`/login?callbackUrl=${window.location.pathname}`);
      return;
    }

    // role-based redirect
    const roleRoutes: Record<string, string> = {
      admin: "/dashboard/admin",
      instructor: "/dashboard/instructor",
      student: "/dashboard/student",
    };

    const target = roleRoutes[user.role] || "/dashboard/student";

    router.replace(target);
  }, [user, loading, router]);

  // show loader until auth resolved
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return null;
}