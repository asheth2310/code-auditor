"use client";

import { useRef, useEffect } from "react";
import { Terminal, Circle } from "lucide-react";
import { cn } from "../lib/utils";

interface EventLogProps {
  events: string[];
}

function getEventStyle(event: string): { color: string; badge: string } {
  if (event.includes("[Auditor]")) return { color: "text-sky-400", badge: "bg-sky-400/10 text-sky-400 border-sky-400/20" };
  if (event.includes("[CloneRepo]")) return { color: "text-purple-400", badge: "bg-purple-400/10 text-purple-400 border-purple-400/20" };
  if (event.includes("[Exploit]")) return { color: "text-amber-400", badge: "bg-amber-400/10 text-amber-400 border-amber-400/20" };
  if (event.includes("[ExploitSandbox]")) return { color: "text-orange-400", badge: "bg-orange-400/10 text-orange-400 border-orange-400/20" };
  if (event.includes("[Patcher]")) return { color: "text-teal-400", badge: "bg-teal-400/10 text-teal-400 border-teal-400/20" };
  if (event.includes("[VerifySandbox]")) return { color: "text-cyan-400", badge: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20" };
  if (event.includes("[PRCreator]")) return { color: "text-[var(--color-accent)]", badge: "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20" };
  if (event.includes("[SelectVuln]")) return { color: "text-violet-400", badge: "bg-violet-400/10 text-violet-400 border-violet-400/20" };
  if (event.includes("[NextVuln]")) return { color: "text-[var(--color-muted-foreground)]", badge: "bg-[var(--color-muted)]/50 text-[var(--color-muted-foreground)] border-[var(--color-border)]/20" };
  if (event.includes("Error") || event.includes("fail")) return { color: "text-red-400", badge: "bg-red-400/10 text-red-400 border-red-400/20" };
  return { color: "text-[var(--color-muted-foreground)]", badge: "bg-[var(--color-muted)]/50 text-[var(--color-muted-foreground)] border-[var(--color-border)]/20" };
}

function extractAgent(event: string): string {
  const match = event.match(/\[([^\]]+)\]/);
  return match ? match[1] : "System";
}

function extractMessage(event: string): string {
  return event.replace(/\[[^\]]+\]\s*/, "");
}

export function EventLog({ events }: EventLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="rounded-2xl border border-[var(--color-border)]/20 bg-[var(--color-card)] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[var(--color-border)]/10 flex items-center gap-2.5 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent shrink-0">
        <div className="p-1.5 rounded-md bg-[var(--color-accent)]/10">
          <Terminal className="w-3.5 h-3.5 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-xs font-bold text-[var(--color-foreground)] uppercase tracking-wider">
          Event Log
        </h3>
        <span className="text-[9px] font-mono text-[var(--color-muted-foreground)] ml-auto bg-[var(--color-muted)]/40 px-2 py-0.5 rounded">
          {events.length} events
        </span>
      </div>

      {/* Log content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 max-h-[500px] bg-[var(--color-background)]/60"
      >
        <div className="space-y-1.5">
          {events.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-xs text-[var(--color-muted-foreground)]/50 italic font-mono">
                Waiting for audit to start...
              </p>
            </div>
          ) : (
            events.map((event, i) => {
              const style = getEventStyle(event);
              const agent = extractAgent(event);
              const message = extractMessage(event);

              return (
                <div
                  key={i}
                  className="flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-[var(--color-muted)]/10 transition-colors group"
                >
                  <span className="text-[9px] font-mono text-[var(--color-muted-foreground)]/30 pt-1 w-5 text-right shrink-0 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 mt-0.5", style.badge)}>
                    {agent}
                  </span>
                  <span className={cn("text-[11px] font-mono leading-relaxed break-all", style.color)}>
                    {message}
                  </span>
                </div>
              );
            })
          )}

          {/* Blinking cursor */}
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="text-[9px] font-mono text-[var(--color-muted-foreground)]/30 w-5 text-right">
              {">>"}
            </span>
            <span className="inline-block w-2 h-4 bg-[var(--color-accent)] animate-pulse rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
