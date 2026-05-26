"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const { user, token, loading } = useSelector(
    (state: RootState) => state.mentoroAuth
  );

  console.log("from dashboard",user, token, loading);

  useEffect(() => {
    // Wait for redux persist hydration and loading state
    if (loading) return;
    if (token === undefined) return;

    // Not authenticated
    if (!token || !user) {
      router.replace(`/login?callbackUrl=/dashboard`);
      return;
    }

    // Redirect based on role
    switch (user.role) {
      case "admin":
        router.replace("/dashboard/admin");
        break;

      case "instructor":
        router.replace("/dashboard/instructor");
        break;

      case "student":
      default:
        router.replace("/dashboard/student");
        break;
    }
  }, [router, token, user, loading]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}