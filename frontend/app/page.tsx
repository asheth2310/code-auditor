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

  const simulateAudit = useCallback((repoName: string) => {
    setIsRunning(true);
    setAudit(null);
    setCompletedNodes([]);
    setActiveNode("clone_repo");

    // Simulate the pipeline progressing through nodes
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

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < nodes.length - 1) {
        setCompletedNodes((prev) => [...prev, nodes[currentIndex]]);
        currentIndex++;
        setActiveNode(nodes[currentIndex]);
      } else {
        clearInterval(interval);
        setCompletedNodes(nodes);
        setActiveNode("done");
        setIsRunning(false);
        // Show mock results
        setAudit({
          ...mockAuditRun,
          repo_name: repoName,
          started_at: new Date(Date.now() - 262000).toISOString(),
          completed_at: new Date().toISOString(),
        });
      }
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Hero + Input */}
          {!audit && !isRunning && <HeroSection />}

          <RepoInput onSubmit={simulateAudit} isRunning={isRunning} />

          {/* Pipeline Visualizer (always show when running or completed) */}
          {(isRunning || audit) && (
            <PipelineVisualizer
              activeNode={activeNode}
              completedNodes={completedNodes}
            />
          )}

          {/* Results */}
          {audit && (
            <>
              <StatsGrid audit={audit} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <VulnerabilityTable
                    vulnerabilities={audit.vulnerabilities}
                    prUrls={audit.pr_urls}
                  />
                </div>
                <div className="lg:col-span-1">
                  <EventLog events={audit.event_log} />
                </div>
              </div>
            </>
          )}

          {/* Event log during running state */}
          {isRunning && !audit && (
            <EventLog
              events={[
                `[CloneRepo] Cloning repository...`,
                `[System] Initializing Docker sandbox...`,
              ]}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[var(--color-border)]/20 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            <p className="text-xs text-[var(--color-muted-foreground)] font-mono">
              Code Auditor v1.0.0
            </p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Built with LangGraph + GPT-4o + Docker
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
