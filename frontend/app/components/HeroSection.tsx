"use client";

import { Shield, Cpu, GitPullRequest, Lock, Scan, Layers } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative text-center space-y-8 py-16 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[var(--color-accent)]/5 blur-[80px] animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-48 h-48 rounded-full bg-sky-500/5 blur-[60px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 backdrop-blur-sm">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-[var(--color-accent)] animate-ping" />
          </div>
          <span className="text-xs font-semibold text-[var(--color-accent)] tracking-wider uppercase">
            AI-Powered Security
          </span>
        </div>

        {/* Main heading */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--color-foreground)] leading-[1.1]">
            Autonomous Code
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[var(--color-accent)] via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Security Auditor
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-[var(--color-accent)]/10 rounded-full blur-sm" />
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            Scans your GitHub repository for vulnerabilities, reproduces exploits in
            sandboxed containers, generates verified patches, and opens Pull Requests — 
            <span className="text-[var(--color-foreground)] font-medium"> fully autonomous</span>.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {[
            { icon: Cpu, label: "GPT-4o Analysis", color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
            { icon: Lock, label: "Docker Sandbox", color: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
            { icon: Scan, label: "Exploit Verification", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
            { icon: GitPullRequest, label: "Auto-PR", color: "text-[var(--color-accent)] bg-[var(--color-accent)]/10 border-[var(--color-accent)]/20" },
            { icon: Shield, label: "Zero False Positives", color: "text-rose-400 bg-rose-400/10 border-rose-400/20" },
            { icon: Layers, label: "Self-Healing", color: "text-teal-400 bg-teal-400/10 border-teal-400/20" },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${color}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
