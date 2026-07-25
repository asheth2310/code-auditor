"use client";

import { CheckCircle2, Loader2, Circle, GitBranch, Search, Bug, FlaskConical, Wrench, ShieldCheck, GitPullRequest, PartyPopper } from "lucide-react";
import { cn } from "../lib/utils";
import type { PipelineNode } from "../lib/types";

interface PipelineVisualizerProps {
  activeNode: PipelineNode;
  completedNodes: PipelineNode[];
}

const PIPELINE_STEPS: { id: PipelineNode; label: string; icon: React.ElementType }[] = [
  { id: "clone_repo", label: "Clone", icon: GitBranch },
  { id: "audit", label: "Audit", icon: Search },
  { id: "generate_exploit", label: "Exploit", icon: Bug },
  { id: "run_exploit_sandbox", label: "Sandbox", icon: FlaskConical },
  { id: "generate_patch", label: "Patch", icon: Wrench },
  { id: "verify_patch_sandbox", label: "Verify", icon: ShieldCheck },
  { id: "create_pr", label: "PR", icon: GitPullRequest },
  { id: "done", label: "Done", icon: PartyPopper },
];

export function PipelineVisualizer({
  activeNode,
  completedNodes,
}: PipelineVisualizerProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)]/20 bg-gradient-to-b from-[var(--color-card)] to-[var(--color-card)]/80 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex items-center justify-center w-8 h-8">
          <div className="absolute inset-0 rounded-full bg-[var(--color-accent)]/20 animate-ping opacity-30" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]" />
        </div>
        <h3 className="text-sm font-semibold text-[var(--color-foreground)] tracking-wide uppercase">
          Pipeline Status
        </h3>
        <div className="ml-auto px-2.5 py-1 rounded-md bg-[var(--color-muted)]/60 border border-[var(--color-border)]/20">
          <span className="text-[10px] font-mono text-[var(--color-accent)]">
            {completedNodes.length}/{PIPELINE_STEPS.length} steps
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 rounded-full bg-[var(--color-muted)]/50 mb-8 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-emerald-400 transition-all duration-700 ease-out"
          style={{ width: `${(completedNodes.length / PIPELINE_STEPS.length) * 100}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-emerald-400 opacity-50 blur-sm transition-all duration-700 ease-out"
          style={{ width: `${(completedNodes.length / PIPELINE_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {PIPELINE_STEPS.map((step) => {
          const isCompleted = completedNodes.includes(step.id);
          const isActive = activeNode === step.id;
          const isPending = !isCompleted && !isActive;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className={cn(
                "relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300",
                isActive && "bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]/30",
                isCompleted && "bg-[var(--color-accent)]/5",
                isPending && "opacity-40"
              )}
            >
              {/* Icon circle */}
              <div
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                  isCompleted && "bg-[var(--color-accent)]/20",
                  isActive && "bg-[var(--color-accent)]/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]",
                  isPending && "bg-[var(--color-muted)]/30"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl border border-[var(--color-accent)]/40 animate-pulse" />
                )}
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)]" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-[var(--color-accent)] animate-spin" />
                ) : (
                  <StepIcon className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-wide uppercase whitespace-nowrap",
                  isCompleted && "text-[var(--color-accent)]",
                  isActive && "text-[var(--color-foreground)]",
                  isPending && "text-[var(--color-muted-foreground)]"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
