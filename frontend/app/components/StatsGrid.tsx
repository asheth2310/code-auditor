"use client";

import { Bug, GitPullRequest, ShieldCheck, Clock } from "lucide-react";
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

  const stats = [
    {
      label: "Vulnerabilities",
      value: audit.vulnerabilities.length,
      icon: Bug,
      color: "text-[var(--color-destructive)]",
      bg: "bg-[var(--color-destructive)]/10",
      detail: `${criticalCount} critical, ${highCount} high`,
    },
    {
      label: "PRs Created",
      value: audit.pr_urls.length,
      icon: GitPullRequest,
      color: "text-[var(--color-accent)]",
      bg: "bg-[var(--color-accent)]/10",
      detail: "Auto-generated fixes",
    },
    {
      label: "Fix Rate",
      value:
        audit.vulnerabilities.length > 0
          ? `${Math.round((audit.pr_urls.length / audit.vulnerabilities.length) * 100)}%`
          : "—",
      icon: ShieldCheck,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
      detail: "Verified patches",
    },
    {
      label: "Duration",
      value: duration ? `${duration}s` : "—",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      detail: "Total pipeline time",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-xl border border-[var(--color-border)]/30 bg-[var(--color-card)] p-4 transition-all duration-200 hover:border-[var(--color-border)]/60"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-[var(--color-foreground)] font-mono">
              {stat.value}
            </p>
            <p className="text-xs font-medium text-[var(--color-muted-foreground)]">
              {stat.label}
            </p>
            <p className="text-[10px] text-[var(--color-muted-foreground)]/70 font-mono">
              {stat.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
