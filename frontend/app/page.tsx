"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Synthesis = dynamic(() => import("./components/Synthesis"), { ssr: false });

/* ─── ICONS ─── */
interface IconProps { className?: string; style?: React.CSSProperties; }
function IconShield({ className, style }: IconProps) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function IconGitBranch({ className, style }: IconProps) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>;
}
function IconSearch({ className, style }: IconProps) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
}
function IconBug({ className, style }: IconProps) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="6" width="8" height="14" rx="4" /><path d="M19 10h-2" /><path d="M7 10H5" /><path d="M19 14h-2" /><path d="M7 14H5" /><path d="M16 2l-2 4" /><path d="M8 2l2 4" /></svg>;
}
function IconBox({ className, style }: IconProps) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
}
function IconWrench({ className, style }: IconProps) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>;
}
function IconCheck({ className, style }: IconProps) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
}
function IconGitPR({ className, style }: IconProps) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" /></svg>;
}

const STEPS = [
  { id: "clone", icon: IconGitBranch, label: "Clone" },
  { id: "audit", icon: IconSearch, label: "AI" },
  { id: "exploit", icon: IconBug, label: "Exploit" },
  { id: "sandbox", icon: IconBox, label: "Docker" },
  { id: "patch", icon: IconWrench, label: "Patch" },
  { id: "verify", icon: IconCheck, label: "Verify" },
  { id: "pr", icon: IconGitPR, label: "PR" },
];

export default function Home() {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditDone, setAuditDone] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [logEvents, setLogEvents] = useState<string[]>([]);
  const [auditResults, setAuditResults] = useState<{ vulnerabilities: number; prs: number; prUrls: string[]; fixRate: number; error?: string | null } | null>(null);

  function startAudit(repoName: string) {
    setIsAuditing(true);
    setAuditDone(false);
    setCompletedSteps([]);
    setCurrentStep("clone");
    setLogEvents([`[System] Starting PatchForge for ${repoName}...`]);
    setAuditResults(null);

    setTimeout(() => document.getElementById("audit-live")?.scrollIntoView({ behavior: "smooth" }), 200);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const cleanRepo = repoName.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "");

    fetch(`${API_URL}/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_name: cleanRepo }),
    })
      .then((res) => res.json())
      .then((data) => {
        const auditId = data.audit_id;

        const poll = setInterval(async () => {
          try {
            const res = await fetch(`${API_URL}/audit/${auditId}`);
            const result = await res.json();

            if (result.event_log?.length > 0) {
              setLogEvents([`[System] Starting PatchForge for ${cleanRepo}...`, ...result.event_log]);
            }

            // Map events to steps
            const done: string[] = [];
            for (const e of result.event_log || []) {
              if (e.includes("[CloneRepo]") && !done.includes("clone")) done.push("clone");
              if (e.includes("[Auditor]") && !done.includes("audit")) done.push("audit");
              if (e.includes("[Exploit]") && !done.includes("exploit")) done.push("exploit");
              if (e.includes("[ExploitSandbox]") && !done.includes("sandbox")) done.push("sandbox");
              if (e.includes("[Patcher]") && !done.includes("patch")) done.push("patch");
              if (e.includes("[VerifySandbox]") && !done.includes("verify")) done.push("verify");
              if (e.includes("[PRCreator]") && !done.includes("pr")) done.push("pr");
            }
            setCompletedSteps(done);
            const allIds = STEPS.map((s) => s.id);
            const next = allIds.find((id) => !done.includes(id));
            setCurrentStep(next || null);

            if (result.status === "completed" || result.status === "failed") {
              clearInterval(poll);
              setCompletedSteps(allIds);
              setCurrentStep(null);
              setAuditDone(true);
              setIsAuditing(false);
              setAuditResults({
                vulnerabilities: result.vulnerabilities?.length || 0,
                prs: result.pr_urls?.length || 0,
                prUrls: result.pr_urls || [],
                fixRate: result.vulnerabilities?.length > 0 ? Math.round(((result.pr_urls?.length || 0) / result.vulnerabilities.length) * 100) : 0,
                error: result.error,
              });
            }
          } catch (err) { console.error(err); }
        }, 3000);
      })
      .catch((err) => {
        setLogEvents((p) => [...p, `[Error] ${err.message}. Is backend running on localhost:8000?`]);
        setIsAuditing(false);
      });
  }

  return (
    <div className="min-h-screen relative bg-black">
      <Synthesis />

      <div className="relative z-10">
        {/* NAV */}
        <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/30 border-b border-white/5">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconShield className="w-5 h-5 text-[#00e599]" />
              <span className="text-sm font-bold text-white tracking-tight">PatchForge</span>
            </div>
            <a href="https://github.com/asheth2310/patchforge" target="_blank" rel="noopener noreferrer" className="text-xs text-white/50 hover:text-white/80 transition-colors cursor-pointer border border-white/10 px-3 py-1.5 rounded-lg hover:border-white/20">
              GitHub ↗
            </a>
          </div>
        </nav>

        {/* HERO */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-14">
          <div className="max-w-2xl w-full text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse" />
              <span className="text-[10px] font-bold text-[#00e599] uppercase tracking-[0.2em]">Autonomous Security</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Forge Secure Patches
              <br />
              <span className="text-[#00e599]">Autonomously</span>
            </h1>

            <p className="text-sm sm:text-base text-white/50 max-w-md mx-auto leading-relaxed">
              AI scans your GitHub repo, proves vulnerabilities in Docker sandboxes, generates fixes, and opens real Pull Requests.
            </p>

            {/* INPUT */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = (e.target as HTMLFormElement).elements.namedItem("repo") as HTMLInputElement;
                if (input?.value?.trim() && !isAuditing) startAudit(input.value.trim());
              }}
              className="max-w-lg mx-auto"
            >
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md focus-within:border-[#00e599]/40 transition-all">
                <input
                  name="repo"
                  type="text"
                  placeholder="owner/repo or GitHub URL"
                  disabled={isAuditing}
                  className="flex-1 bg-transparent text-white placeholder:text-white/25 text-sm font-mono px-4 py-3 outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isAuditing}
                  className="px-5 py-3 rounded-xl bg-[#00e599] text-black font-bold text-sm hover:bg-[#00e599]/90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isAuditing ? "Scanning..." : "Audit →"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* LIVE AUDIT */}
        {(isAuditing || auditDone) && (
          <section id="audit-live" className="px-6 py-20">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Pipeline steps */}
              <div className="flex items-center justify-between gap-1 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                {STEPS.map((step) => {
                  const done = completedSteps.includes(step.id);
                  const active = currentStep === step.id;
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        done ? "bg-[#00e599]/20 border border-[#00e599]/40" :
                        active ? "bg-[#00e599]/10 border border-[#00e599]/60 shadow-[0_0_20px_#00e59930]" :
                        "bg-white/5 border border-white/10"
                      }`}>
                        {done ? <IconCheck className="w-4 h-4 text-[#00e599]" /> :
                         active ? <div className="w-3 h-3 border-2 border-[#00e599] border-t-transparent rounded-full animate-spin" /> :
                         <step.icon className="w-4 h-4 text-white/30" />}
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${
                        done ? "text-[#00e599]" : active ? "text-white" : "text-white/20"
                      }`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Log */}
              <div className="rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                    <div className="w-2 h-2 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-[10px] font-mono text-white/30 ml-2">patchforge — live</span>
                </div>
                <div className="p-4 max-h-72 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-0.5">
                  {logEvents.map((e, i) => (
                    <p key={i} className={
                      e.includes("[Error]") ? "text-red-400" :
                      e.includes("[PRCreator]") ? "text-[#00e599]" :
                      e.includes("[Patcher]") || e.includes("[Verify]") ? "text-teal-400" :
                      e.includes("[Exploit]") || e.includes("[Sandbox]") ? "text-amber-400" :
                      e.includes("[Auditor]") ? "text-sky-400" :
                      e.includes("[Clone]") ? "text-purple-400" :
                      "text-white/50"
                    }>{e}</p>
                  ))}
                  {isAuditing && <span className="inline-block w-1.5 h-3.5 bg-[#00e599] animate-pulse rounded-sm" />}
                </div>
              </div>

              {/* Results */}
              {auditDone && auditResults && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { val: auditResults.vulnerabilities, label: "Vulns", color: "text-red-400" },
                      { val: auditResults.prs, label: "PRs", color: "text-[#00e599]" },
                      { val: `${auditResults.fixRate}%`, label: "Fixed", color: "text-[#00e599]" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl p-5 bg-white/[0.03] border border-white/10 text-center backdrop-blur-sm">
                        <p className={`text-3xl font-black font-mono ${s.color}`}>{s.val}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {auditResults.prUrls.length > 0 && (
                    <div className="rounded-xl p-4 bg-[#00e599]/5 border border-[#00e599]/20 space-y-2">
                      <p className="text-[10px] font-bold text-[#00e599] uppercase tracking-widest">Pull Requests</p>
                      {auditResults.prUrls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/5 hover:border-[#00e599]/30 transition-all cursor-pointer group">
                          <IconGitPR className="w-3.5 h-3.5 text-[#00e599]" />
                          <span className="text-xs font-mono text-white/60 group-hover:text-white truncate">{url}</span>
                          <span className="ml-auto text-[#00e599] text-xs">→</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {auditResults.error && (
                    <div className="rounded-xl p-4 bg-red-500/5 border border-red-500/20">
                      <p className="text-xs font-mono text-red-400">{auditResults.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="border-t border-white/5 py-6 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="text-[10px] text-white/20 font-mono">PatchForge v1.0</span>
            <span className="text-[10px] text-white/20">LangGraph · GPT-4o · Docker</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
