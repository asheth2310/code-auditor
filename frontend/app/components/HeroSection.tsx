"use client";

import { Shield, Cpu, GitPullRequest, Lock } from "lucide-react";

export function HeroSection() {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse-glow" />
        <span className="text-xs font-mono text-[var(--color-accent)]">
          AI-Powered Security
        </span>
      </div>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-foreground)]">
        Autonomous Code
        <br />
        <span className="glow-green text-[var(--color-accent)]">
          Security Auditor
        </span>
      </h2>

      <p className="text-sm sm:text-base text-[var(--color-muted-foreground)] max-w-lg mx-auto leading-relaxed">
        Scans your GitHub repository for vulnerabilities, reproduces exploits in
        sandboxed containers, generates verified patches, and opens Pull Requests
        — fully autonomous.
      </p>

      <div className="flex items-center justify-center gap-6 pt-4">
        {[
          { icon: Cpu, label: "GPT-4o" },
          { icon: Lock, label: "Docker Sandbox" },
          { icon: GitPullRequest, label: "Auto-PR" },
          { icon: Shield, label: "Zero FP" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]"
          >
            <Icon className="w-3.5 h-3.5 text-[var(--color-accent)]/70" />
            <span className="font-mono">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
