"use client";

import { useState } from "react";
import { Search, Zap, Loader2, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

interface RepoInputProps {
  onSubmit: (repoName: string) => void;
  isRunning: boolean;
}

export function RepoInput({ onSubmit, isRunning }: RepoInputProps) {
  const [repo, setRepo] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repo.trim() && !isRunning) {
      onSubmit(repo.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        {/* Outer glow */}
        <div className={cn(
          "absolute -inset-1 rounded-2xl bg-gradient-to-r from-[var(--color-accent)]/20 via-emerald-400/20 to-teal-400/20 blur-lg transition-opacity duration-500",
          isFocused ? "opacity-100" : "opacity-0"
        )} />

        {/* Input container */}
        <div className={cn(
          "relative flex items-center gap-3 bg-[var(--color-card)] border rounded-2xl px-5 py-4 transition-all duration-300",
          isFocused
            ? "border-[var(--color-accent)]/50 shadow-lg shadow-[var(--color-accent)]/5"
            : "border-[var(--color-border)]/30 hover:border-[var(--color-border)]/50"
        )}>
          <Search className={cn(
            "w-5 h-5 shrink-0 transition-colors",
            isFocused ? "text-[var(--color-accent)]" : "text-[var(--color-muted-foreground)]"
          )} />
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="owner/repository"
            disabled={isRunning}
            className="flex-1 bg-transparent text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/40 font-mono text-base outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!repo.trim() || isRunning}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer",
              "bg-gradient-to-r from-[var(--color-accent)] to-emerald-500 text-[var(--color-background)]",
              "hover:shadow-lg hover:shadow-[var(--color-accent)]/25 hover:scale-[1.02] active:scale-[0.98]",
              "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
            )}
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>
              {isRunning ? "Scanning..." : "Audit"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <p className="text-xs text-[var(--color-muted-foreground)]/60 font-mono">
          Enter a GitHub repo in <code className="text-[var(--color-accent)]/60 font-semibold">owner/repo</code> format
        </p>
      </div>
    </form>
  );
}
