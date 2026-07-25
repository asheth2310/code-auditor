"use client";

import { Shield, Activity } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)]/30 bg-[var(--color-background)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-[var(--color-accent)]" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[var(--color-accent)] rounded-full animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-[var(--color-foreground)]">
                Code Auditor
              </h1>
              <p className="text-xs text-[var(--color-muted-foreground)] font-mono">
                Autonomous Security Scanner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-muted)]/50 border border-[var(--color-border)]/30">
              <Activity className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              <span className="text-xs font-mono text-[var(--color-muted-foreground)]">
                System Online
              </span>
            </div>
            <a
              href="https://github.com/asheth2310/code-auditor"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-[var(--color-muted)]/50 transition-colors cursor-pointer"
              aria-label="View on GitHub"
            >
              <svg className="w-5 h-5 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
