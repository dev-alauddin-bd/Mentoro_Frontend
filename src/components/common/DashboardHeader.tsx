"use client";

import { ReactNode } from "react";

interface DashboardHeaderProps {
  badgeIcon?: ReactNode;
  badgeText?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function DashboardHeader({
  badgeIcon,
  badgeText,
  title,
  subtitle,
  action,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 ">
      <div className="space-y-2">
        {badgeText && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
            {badgeIcon} {badgeText}
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-tight italic">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground font-medium max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
