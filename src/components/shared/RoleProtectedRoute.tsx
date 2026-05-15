"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import { Role } from "@/interfaces/user.interface";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.mentoroAuth);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user && !allowedRoles.includes(user.role)) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, loading, user, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
