export interface Vulnerability {
  file_path: string;
  line_range: string;
  vuln_type: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  source_code: string;
}

export interface AuditRun {
  id: string;
  repo_name: string;
  status: "idle" | "cloning" | "auditing" | "exploiting" | "patching" | "verifying" | "creating_pr" | "completed" | "failed";
  vulnerabilities: Vulnerability[];
  current_vuln_index: number;
  patch_attempts: number;
  max_retries: number;
  pr_urls: string[];
  event_log: string[];
  started_at: string;
  completed_at?: string;
  error?: string;
}

export type PipelineNode =
  | "clone_repo"
  | "audit"
  | "select_vuln"
  | "generate_exploit"
  | "run_exploit_sandbox"
  | "generate_patch"
  | "verify_patch_sandbox"
  | "create_pr"
  | "next_vuln"
  | "done";
