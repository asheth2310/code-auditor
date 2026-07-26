"use client";

import { useState } from "react";

/* ─────────────────────── ICON COMPONENTS ─────────────────────── */

interface IconProps { className?: string; style?: React.CSSProperties; }

function IconShield({ className = "", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconGitBranch({ className = "", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function IconSearch({ className = "", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconBug({ className = "", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="6" width="8" height="14" rx="4" /><path d="M19 10h-2" /><path d="M7 10H5" /><path d="M19 14h-2" /><path d="M7 14H5" /><path d="M16 2l-2 4" /><path d="M8 2l2 4" />
    </svg>
  );
}

function IconBox({ className = "", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconWrench({ className = "", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconCheck({ className = "", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconGitPR({ className = "", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" />
    </svg>
  );
}

function IconGithub({ className = "", style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

/* ─────────────────────── PIPELINE STEPS DATA ─────────────────────── */

const PIPELINE_STEPS = [
  {
    id: "clone",
    icon: IconGitBranch,
    title: "Clone Repository",
    description: "Clones your GitHub repo and reads all Python source files into memory for analysis.",
    detail: "git clone → read .py files",
    color: "#a78bfa",
  },
  {
    id: "audit",
    icon: IconSearch,
    title: "AI Security Audit",
    description: "Gemini analyzes source code for 7 vulnerability categories: SQL injection, command injection, path traversal, XSS, and more.",
    detail: "Gemini 2.0 Flash → structured JSON",
    color: "#4da6ff",
  },
  {
    id: "exploit",
    icon: IconBug,
    title: "Generate Exploit",
    description: "For each vulnerability found, generates a minimal pytest that proves the bug exists. Test PASSES when vuln is present.",
    detail: "AI → pytest exploit test",
    color: "#ffb443",
  },
  {
    id: "sandbox",
    icon: IconBox,
    title: "Docker Sandbox",
    description: "Runs the exploit test inside an isolated Docker container — no network, 512MB RAM, 30s timeout. Confirms the vulnerability is real.",
    detail: "network=none, mem=512MB",
    color: "#ff6b8a",
  },
  {
    id: "patch",
    icon: IconWrench,
    title: "Generate Patch",
    description: "AI generates a complete fixed version of the vulnerable file. If verification fails, receives error feedback and self-heals (up to 3 retries).",
    detail: "AI fix → self-healing loop",
    color: "#00e599",
  },
  {
    id: "verify",
    icon: IconCheck,
    title: "Verify Fix",
    description: "Runs the same exploit test with the patched code. The test must now FAIL (vulnerability no longer exploitable) to confirm the fix works.",
    detail: "exit_code=0 → fix verified",
    color: "#00d4aa",
  },
  {
    id: "pr",
    icon: IconGitPR,
    title: "Create Pull Request",
    description: "Creates a GitHub branch, commits the patch + exploit test, and opens a PR with full vulnerability details, severity, and reproduction steps.",
    detail: "branch → commit → PR",
    color: "#00e599",
  },
];

/* ─────────────────────── PAGE COMPONENT ─────────────────────── */

export default function Home() {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[800px] h-[800px] rounded-full bg-[var(--accent)]/[0.02] blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-[var(--info)]/[0.02] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--accent) 1px, transparent 0)', backgroundSize: '50px 50px' }} />
      </div>

      <div className="relative z-10">
        {/* ─── NAV ─── */}
        <nav className="fixed top-0 w-full z-50 glass">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <IconShield className="w-6 h-6 text-[var(--accent)]" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--accent)] rounded-full animate-glow" />
              </div>
              <span className="text-base font-bold tracking-tight">PatchForge</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#workflow" className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer">Workflow</a>
              <a href="#tech" className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer">Tech Stack</a>
              <a
                href="https://github.com/asheth2310/patchforge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--accent-dim)] text-xs font-medium transition-all cursor-pointer"
              >
                <IconGithub className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </nav>

        {/* ─── HERO ─── */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 rounded-full bg-[var(--accent)] animate-glow" />
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              </div>
              <span className="text-[11px] font-semibold text-[var(--accent)] tracking-widest uppercase">
                Autonomous Security
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
              <span className="text-[var(--text)]">Forge Secure</span>
              <br />
              <span className="bg-gradient-to-r from-[var(--accent)] via-emerald-300 to-teal-300 bg-clip-text text-transparent text-glow">
                Patches Autonomously
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
              PatchForge scans your GitHub repos for vulnerabilities, proves them with exploit tests in 
              Docker sandboxes, generates verified patches, and opens Pull Requests — 
              <span className="text-[var(--text)] font-medium"> zero human intervention</span>.
            </p>

            {/* CTA */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <a
                href="https://github.com/asheth2310/patchforge"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-[var(--bg)] font-semibold text-sm hover:shadow-lg hover:shadow-[var(--accent-dim)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <IconGithub className="w-4 h-4" />
                View on GitHub
              </a>
              <a
                href="#workflow"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass font-medium text-sm hover:border-[var(--accent-dim)] transition-all cursor-pointer"
              >
                See How It Works
                <span className="text-[var(--accent)]">↓</span>
              </a>
            </div>

            {/* Repo Input */}
            <div className="mt-10 max-w-xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.target as HTMLFormElement).elements.namedItem("repo") as HTMLInputElement;
                  const val = input?.value?.trim();
                  if (val) {
                    alert(`🛡️ Audit requested for: ${val}\n\nTo run this for real:\n\n1. Clone the repo locally\n2. Set up .env with GITHUB_MODELS_TOKEN\n3. Run: python -m code_auditor.main --repo ${val} --verbose\n\nSee README for full setup.`);
                  }
                }}
                className="relative group"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[var(--accent)]/20 via-transparent to-[var(--accent)]/20 blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4 focus-within:border-[var(--accent)]/40 transition-all">
                  <IconGithub className="w-5 h-5 text-[var(--text-dim)] shrink-0" />
                  <input
                    name="repo"
                    type="text"
                    placeholder="owner/repository"
                    className="flex-1 bg-transparent text-[var(--text)] placeholder:text-[var(--text-dim)] font-mono text-sm outline-none"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--bg)] font-semibold text-sm hover:shadow-lg hover:shadow-[var(--accent-dim)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <IconShield className="w-4 h-4" />
                    Audit
                  </button>
                </div>
              </form>
              <p className="text-center text-[11px] text-[var(--text-dim)] mt-3 font-mono">
                Enter a GitHub repo to scan • Requires local backend running
              </p>
            </div>

            {/* Terminal preview */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-card)]">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--destructive)]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]/60" />
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-dim)] ml-2">patchforge — terminal</span>
                </div>
                <div className="p-5 font-mono text-[12px] leading-relaxed space-y-1 text-left">
                  <p className="text-[var(--text-dim)]">$ python -m patchforge --repo acme/web-api</p>
                  <p className="text-[var(--text-muted)]">&nbsp;</p>
                  <p className="text-[var(--info)]">[Auditor] Found 4 vulnerabilities in 12 files</p>
                  <p className="text-[var(--warning)]">[Exploit] Generated pytest for sql_injection</p>
                  <p className="text-[var(--destructive)]">[Sandbox] exit_code=1 — vulnerability confirmed</p>
                  <p className="text-[var(--accent)]">[Patcher] Fix generated (Attempt 1)</p>
                  <p className="text-[var(--accent)]">[Verify] exit_code=0 — fix verified ✓</p>
                  <p className="text-[var(--accent)]">[PR] → github.com/acme/web-api/pull/42</p>
                  <p className="text-[var(--text-muted)]">&nbsp;</p>
                  <p className="text-[var(--text)]">✓ 4 vulnerabilities patched, 4 PRs opened</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WORKFLOW ─── */}
        <section id="workflow" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <p className="text-[11px] font-bold text-[var(--accent)] tracking-widest uppercase">Pipeline</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How PatchForge Works</h2>
              <p className="text-[var(--text-muted)] max-w-lg mx-auto">
                Seven AI agents orchestrated by LangGraph, each specialized for one step of the security audit lifecycle.
              </p>
            </div>

            {/* Pipeline flow */}
            <div className="space-y-4">
              {PIPELINE_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className="group"
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  <div className={`relative rounded-2xl p-6 transition-all duration-300 cursor-default ${
                    activeStep === step.id
                      ? "bg-[var(--bg-elevated)] border border-[var(--border)] shadow-2xl shadow-black/30 scale-[1.01]"
                      : "bg-[var(--bg-card)]/50 border border-transparent hover:border-[var(--border)]/50"
                  }`}>
                    <div className="flex items-start gap-5">
                      {/* Step number + icon */}
                      <div className="shrink-0 flex flex-col items-center gap-2">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                          style={{
                            backgroundColor: activeStep === step.id ? `${step.color}15` : 'var(--bg-elevated)',
                            borderColor: activeStep === step.id ? `${step.color}40` : 'var(--border)',
                            borderWidth: '1px',
                          }}
                        >
                          <step.icon
                            className="w-5 h-5 transition-colors duration-300"
                            style={{ color: activeStep === step.id ? step.color : 'var(--text-muted)' }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-[var(--text-dim)] tracking-widest">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-semibold text-[var(--text)]">
                            {step.title}
                          </h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-dim)] border border-[var(--border)]">
                            {step.detail}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      {index < PIPELINE_STEPS.length - 1 && (
                        <div className="hidden sm:block shrink-0 pt-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--text-dim)]">
                            <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Connector line */}
                    {index < PIPELINE_STEPS.length - 1 && (
                      <div className="absolute -bottom-4 left-[2.25rem] w-px h-4 bg-gradient-to-b from-[var(--border)] to-transparent" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TECH STACK ─── */}
        <section id="tech" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <p className="text-[11px] font-bold text-[var(--accent)] tracking-widest uppercase">Stack</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built With</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "LangGraph", desc: "Multi-agent orchestration", category: "Core" },
                { name: "Gemini 2.0", desc: "AI vulnerability analysis", category: "AI" },
                { name: "Docker", desc: "Sandboxed code execution", category: "Security" },
                { name: "FastAPI", desc: "Backend API server", category: "Backend" },
                { name: "PyGithub", desc: "GitHub API integration", category: "Integration" },
                { name: "Next.js", desc: "Frontend framework", category: "Frontend" },
                { name: "FastMCP", desc: "Model Context Protocol", category: "Protocol" },
                { name: "pytest", desc: "Exploit test framework", category: "Testing" },
              ].map((tech) => (
                <div key={tech.name} className="rounded-xl p-5 bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent-dim)] transition-all group">
                  <p className="text-[9px] font-bold text-[var(--accent)] tracking-widest uppercase mb-2">{tech.category}</p>
                  <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{tech.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SAFETY ─── */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl p-8 sm:p-12 gradient-border bg-[var(--bg-card)]">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                  <IconShield className="w-7 h-7 text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">Zero False Positives</h2>
                <p className="text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
                  Every vulnerability is proven exploitable in a sandboxed environment before a patch is generated. 
                  Every patch is verified by re-running the exploit. Only verified fixes get a PR.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  {[
                    { label: "Network", value: "Isolated" },
                    { label: "Memory", value: "512MB Max" },
                    { label: "Timeout", value: "30 Seconds" },
                    { label: "Cleanup", value: "Automatic" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-lg font-bold text-[var(--accent)] font-mono">{item.value}</p>
                      <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-[var(--border)] py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <IconShield className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-sm font-semibold">PatchForge</span>
            </div>
            <p className="text-xs text-[var(--text-dim)]">
              Open source · MIT License · Built by Aagam Sheth
            </p>
            <a
              href="https://github.com/asheth2310/patchforge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              github.com/asheth2310/patchforge
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
