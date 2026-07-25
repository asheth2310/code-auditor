"use client";

import { useState, useCallback } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { RepoInput } from "./components/RepoInput";
import { StatsGrid } from "./components/StatsGrid";
import { PipelineVisualizer } from "./components/PipelineVisualizer";
import { VulnerabilityTable } from "./components/VulnerabilityTable";
import { EventLog } from "./components/EventLog";
import { mockAuditRun } from "./lib/mock-data";
import type { AuditRun, PipelineNode } from "./lib/types";

export default function Home() {
  const [audit, setAudit] = useState<AuditRun | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeNode, setActiveNode] = useState<PipelineNode>("clone_repo");
  const [completedNodes, setCompletedNodes] = useState<PipelineNode[]>([]);
  const [liveEvents, setLiveEvents] = useState<string[]>([]);

  const simulateAudit = useCallback((repoName: string) => {
    setIsRunning(true);
    setAudit(null);
    setCompletedNodes([]);
    setActiveNode("clone_repo");
    setLiveEvents([]);

    const nodes: PipelineNode[] = [
      "clone_repo",
      "audit",
      "generate_exploit",
      "run_exploit_sandbox",
      "generate_patch",
      "verify_patch_sandbox",
      "create_pr",
      "done",
    ];

    const eventSequence = [
      `[System] Initializing pipeline for ${repoName}...`,
      `[CloneRepo] Cloning ${repoName}...`,
      `[CloneRepo] Found 12 Python files`,
      `[Auditor] Analyzing source code with GPT-4o...`,
      `[Auditor] Found 4 vulnerabilities in 12 files`,
      `[SelectVuln] Processing vuln 1/4: sql_injection in app.py`,
      `[Exploit] Generating pytest exploit...`,
      `[ExploitSandbox] Running in Docker (network: none, mem: 512MB)`,
      `[ExploitSandbox] exit_code=1 — vulnerability confirmed`,
      `[Patcher] Generating fix with GPT-4o (Attempt 1)`,
      `[VerifySandbox] Verifying patch...`,
      `[VerifySandbox] exit_code=0 — fix verified ✓`,
      `[PRCreator] Opening Pull Request...`,
      `[PRCreator] PR created: github.com/${repoName}/pull/42`,
    ];

    let currentNodeIndex = 0;
    let eventIndex = 0;

    // Progress events
    const eventInterval = setInterval(() => {
      if (eventIndex < eventSequence.length) {
        setLiveEvents((prev) => [...prev, eventSequence[eventIndex]]);
        eventIndex++;
      }
    }, 400);

    // Progress nodes
    const nodeInterval = setInterval(() => {
      if (currentNodeIndex < nodes.length - 1) {
        setCompletedNodes((prev) => [...prev, nodes[currentNodeIndex]]);
        currentNodeIndex++;
        setActiveNode(nodes[currentNodeIndex]);
      } else {
        clearInterval(nodeInterval);
        clearInterval(eventInterval);
        setCompletedNodes(nodes);
        setActiveNode("done");
        setIsRunning(false);
        setAudit({
          ...mockAuditRun,
          repo_name: repoName,
          started_at: new Date(Date.now() - 262000).toISOString(),
          completed_at: new Date().toISOString(),
        });
      }
    }, 900);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] relative">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[var(--color-accent)]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-sky-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-violet-500/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          {/* Hero — only show when idle */}
          {!audit && !isRunning && <HeroSection />}

          {/* Repo input */}
          <RepoInput onSubmit={simulateAudit} isRunning={isRunning} />

          {/* Pipeline Visualizer */}
          {(isRunning || audit) && (
            <PipelineVisualizer
              activeNode={activeNode}
              completedNodes={completedNodes}
            />
          )}

          {/* Live event log during scan */}
          {isRunning && !audit && (
            <EventLog events={liveEvents} />
          )}

          {/* Results dashboard */}
          {audit && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <StatsGrid audit={audit} />

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <div className="xl:col-span-3">
                  <VulnerabilityTable
                    vulnerabilities={audit.vulnerabilities}
                    prUrls={audit.pr_urls}
                  />
                </div>
                <div className="xl:col-span-2">
                  <EventLog events={audit.event_log} />
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[var(--color-border)]/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              <p className="text-xs text-[var(--color-muted-foreground)] font-mono">
                Code Auditor v1.0.0
              </p>
            </div>
            <p className="text-xs text-[var(--color-muted-foreground)]/60">
              Powered by LangGraph · GPT-4o · Docker · PyGithub
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
