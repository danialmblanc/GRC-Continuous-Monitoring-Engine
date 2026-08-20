export interface Evidence {
  evidence_id: string;
  control_id: string;
  source: "gcp" | "manual" | "ai";
  service: string;
  resource_type: string;
  resource_name: string;
  resource_id: string;
  project_id: string;
  organization_id?: string;
  region?: string;
  timestamp_collected: string; // ISO-8601
  raw_reference: any;
  normalized_fields: Record<string, any>;
  confidence: "high" | "medium" | "low";
  notes?: string;
}

export type ControlStatus = "pass" | "warning" | "fail" | "unknown";

export interface Finding {
  finding_id: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  resource: string;
  first_seen: string; // ISO-8601
  last_seen: string; // ISO-8601
  resolved: boolean;
  days_open: number;
  recommended_fix: string;
}

export interface ControlOutput {
  control_id: string;
  control_name: string;
  category: string;
  status: ControlStatus;
  last_checked: string; // ISO-8601
  risk_score: number;
  evidence_summary: string;
  evidence: Evidence[];
  findings: Finding[];
  data_source: ("gcp" | "manual" | "ai")[];
  gcp_services_used: string[];
  is_directly_measurable: boolean;
  limitations: string[];
  recommended_remediation: string[];
  framework_mappings: {
    soc2: string[];
    iso27001: string[];
    hipaa: string[];
  };
}

export interface CategorySummary {
  category: string;
  total: number;
  green: number;
  yellow: number;
  red: number;
  gray: number;
}
