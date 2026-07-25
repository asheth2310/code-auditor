"use client";

import { useRef, useEffect } from "react";
import { Terminal } from "lucide-react";
import { cn } from "../lib/utils";

interface EventLogProps {
  events: string[];
}

function getEventColor(event: string): string {
  if (event.includes("[Auditor]")) return "text-sky-400";
  if (event.includes("[CloneRepo]")) return "text-purple-400";
  if (event.includes("[Exploit]")) return "text-amber-400";
  if (event.includes("[ExploitSandbox]")) return "text-orange-400";
  if (event.includes("[Patcher]")) return "text-teal-400";
  if (event.includes("[VerifySandbox]")) return "text-cyan-400";
  if (event.includes("[PRCreator]")) return "text-[var(--color-accent)]";
  if (event.includes("[SelectVuln]")) return "text-violet-400";
  if (event.includes("[NextVuln]")) return "text-[var(--color-muted-foreground)]";
  if (event.includes("Error") || event.includes("fail"))
    return "text-[var(--color-destructive)]";
  return "text-[var(--color-muted-foreground)]";
}

export function EventLog({ events }: EventLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="rounded-xl border border-[var(--color-border)]/30 bg-[var(--color-card)] overflow-hidden flex flex-col">
      <div className="px-5 py-3 border-b border-[var(--color-border)]/20 flex items-center gap-2 shrink-0">
        <Terminal className="w-4 h-4 text-[var(--color-accent)]" />
        <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
          Event Log
        </h3>
        <span className="text-[10px] font-mono text-[var(--color-muted-foreground)] ml-auto">
          {events.length} events
        </span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 max-h-80 bg-[var(--color-background)]/50"
      >
        <div className="space-y-1 font-mono text-xs">
          {events.length === 0 ? (
            <p className="text-[var(--color-muted-foreground)]/50 italic">
              Waiting for audit to start...
            </p>
          ) : (
            events.map((event, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2 py-0.5",
                  getEventColor(event)
                )}
              >
                <span className="text-[var(--color-muted-foreground)]/40 select-none shrink-0 w-6 text-right">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="break-all">{event}</span>
              </div>
            ))
          )}
          <div className="flex items-center gap-1 pt-1">
            <span className="text-[var(--color-accent)] animate-pulse-glow">
              ▊
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
