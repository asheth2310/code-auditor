"use client";

import { useState } from "react";
import { Search, Zap, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

interface RepoInputProps {
  onSubmit: (repoName: string) => void;
  isRunning: boolean;
}

export function RepoInput({ onSubmit, isRunning }: RepoInputProps) {
  const [repo, setRepo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repo.trim() && !isRunning) {
      onSubmit(repo.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-accent)]/20 via-[var(--color-accent)]/10 to-[var(--color-accent)]/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center gap-2 bg-[var(--color-card)] border border-[var(--color-border)]/40 rounded-xl px-4 py-3 focus-within:border-[var(--color-accent)]/50 transition-all duration-300">
          <Search className="w-5 h-5 text-[var(--color-muted-foreground)] shrink-0" />
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="owner/repository"
            disabled={isRunning}
            className="flex-1 bg-transparent text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]/60 font-mono text-sm outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!repo.trim() || isRunning}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer",
              "bg-[var(--color-accent)] text-[var(--color-background)] hover:bg-[var(--color-accent)]/90",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
            )}
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isRunning ? "Scanning..." : "Audit"}
            </span>
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-[var(--color-muted-foreground)] mt-3 font-mono">
        Enter a GitHub repository in <code className="text-[var(--color-accent)]/80">owner/repo</code> format
      </p>
    </form>
  );
}
