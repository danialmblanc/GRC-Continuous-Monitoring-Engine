export type ControlStatus = 'pass' | 'warning' | 'fail' | 'unknown';

export interface ControlOutput {
  control_id: string;
  control_name: string;
  category: string;
  status: ControlStatus;
  last_checked: string;
  evidence: any[];
  findings: string[];
  risk_score: number;
  source: ('gcp' | 'manual' | 'ai')[];
  remediation: string;
  mapping?: {
    soc2?: string[];
    iso27001?: string[];
    hipaa?: string[];
  };
}

export interface EvaluationInput {
  condition: boolean;
  evidence: any;
  findings?: string[];
  remediation?: string;
}

export const DEMO_MODE = true;
