"use client";

import { Bug, GitPullRequest, ShieldCheck, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { AuditRun } from "../lib/types";

interface StatsGridProps {
  audit: AuditRun;
}

export function StatsGrid({ audit }: StatsGridProps) {
  const criticalCount = audit.vulnerabilities.filter(
    (v) => v.severity === "critical"
  ).length;
  const highCount = audit.vulnerabilities.filter(
    (v) => v.severity === "high"
  ).length;

  const duration =
    audit.started_at && audit.completed_at
      ? Math.round(
          (new Date(audit.completed_at).getTime() -
            new Date(audit.started_at).getTime()) /
            1000
        )
      : null;

  const fixRate = audit.vulnerabilities.length > 0
    ? Math.round((audit.pr_urls.length / audit.vulnerabilities.length) * 100)
    : 0;

  const stats = [
    {
      label: "Vulnerabilities",
      value: audit.vulnerabilities.length,
      icon: Bug,
      color: "from-red-500 to-rose-600",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      detail: `${criticalCount} critical · ${highCount} high`,
    },
    {
      label: "PRs Created",
      value: audit.pr_urls.length,
      icon: GitPullRequest,
      color: "from-emerald-500 to-green-600",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      detail: "Auto-generated fixes",
    },
    {
      label: "Fix Rate",
      value: `${fixRate}%`,
      icon: ShieldCheck,
      color: "from-sky-500 to-blue-600",
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-400",
      detail: "Verified & patched",
    },
    {
      label: "Duration",
      value: duration ? `${duration}s` : "—",
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      detail: "Total pipeline time",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)]/20 bg-[var(--color-card)] p-5 transition-all duration-300 hover:border-[var(--color-border)]/40 hover:shadow-lg hover:shadow-black/20"
        >
          {/* Gradient accent at top */}
          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stat.color} opacity-60`} />

          <div className="flex items-start justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${stat.iconBg} transition-transform duration-300 group-hover:scale-110`}>
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <TrendingUp className="w-3.5 h-3.5 text-[var(--color-muted-foreground)]/40" />
          </div>

          <div className="space-y-1">
            <p className="text-3xl font-black text-[var(--color-foreground)] font-mono tracking-tight">
              {stat.value}
            </p>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-[10px] text-[var(--color-muted-foreground)]/60 font-mono pt-1">
              {stat.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
