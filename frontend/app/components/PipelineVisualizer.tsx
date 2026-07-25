"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import type { PipelineNode } from "../lib/types";

interface PipelineVisualizerProps {
  activeNode: PipelineNode;
  completedNodes: PipelineNode[];
}

const PIPELINE_STEPS: { id: PipelineNode; label: string }[] = [
  { id: "clone_repo", label: "Clone" },
  { id: "audit", label: "Audit" },
  { id: "generate_exploit", label: "Exploit" },
  { id: "run_exploit_sandbox", label: "Sandbox" },
  { id: "generate_patch", label: "Patch" },
  { id: "verify_patch_sandbox", label: "Verify" },
  { id: "create_pr", label: "PR" },
  { id: "done", label: "Done" },
];

export function PipelineVisualizer({
  activeNode,
  completedNodes,
}: PipelineVisualizerProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)]/30 bg-[var(--color-card)] p-5">
      <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse-glow" />
        Pipeline Status
      </h3>
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
        {PIPELINE_STEPS.map((step, index) => {
          const isCompleted = completedNodes.includes(step.id);
          const isActive = activeNode === step.id;
          const isPending = !isCompleted && !isActive;

          return (
            <div key={step.id} className="flex items-center gap-1">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted &&
                      "bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/50",
                    isActive &&
                      "bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)] shadow-[0_0_12px_rgba(34,197,94,0.3)]",
                    isPending &&
                      "bg-[var(--color-muted)]/50 border border-[var(--color-border)]/30"
                  )}
                >
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)]" />
                  )}
                  {isActive && (
                    <Loader2 className="w-4 h-4 text-[var(--color-accent)] animate-spin" />
                  )}
                  {isPending && (
                    <Circle className="w-3 h-3 text-[var(--color-muted-foreground)]/50" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-mono whitespace-nowrap",
                    isCompleted && "text-[var(--color-accent)]",
                    isActive && "text-[var(--color-foreground)] font-medium",
                    isPending && "text-[var(--color-muted-foreground)]/50"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < PIPELINE_STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-6 h-px mb-5",
                    isCompleted
                      ? "bg-[var(--color-accent)]/50"
                      : "bg-[var(--color-border)]/30"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
