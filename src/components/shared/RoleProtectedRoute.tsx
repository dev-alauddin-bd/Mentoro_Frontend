"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import { Role } from "@/interfaces/user.interface";

interface RoleauthenticationedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function RoleauthenticationedRoute({ children, allowedRoles }: RoleauthenticationedRouteProps) {
  const { user, loading } = useSelector((state: RootState) => state.mentoroAuth);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user && !allowedRoles.includes(user.role)) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
