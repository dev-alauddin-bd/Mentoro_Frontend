"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.mentoroAuth);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user) {
        // Redirect based on role
        switch (user.role) {
          case "admin":
            router.push("/dashboard/admin");
            break;
          case "instructor":
            router.push("/dashboard/instructor");
            break;
          case "student":
          default:
            router.push("/dashboard/student");
            break;
        }
      }
    }
  }, [isAuthenticated, loading, user, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
