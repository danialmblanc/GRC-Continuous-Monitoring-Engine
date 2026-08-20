import { ControlOutput, ControlStatus, EvaluationInput } from '../types';

export function evaluate(
  controlId: string,
  controlName: string,
  category: string,
  input: EvaluationInput
): ControlOutput {
  const status: ControlStatus = input.condition ? 'pass' : 'fail';
  
  return {
    control_id: controlId,
    control_name: controlName,
    category,
    status,
    last_checked: new Date().toISOString(),
    evidence: Array.isArray(input.evidence) ? input.evidence : [input.evidence],
    findings: input.findings || (input.condition ? [] : [`Control ${controlId} failed validation.`]),
    risk_score: input.condition ? 0 : 70, // Default risk score for failure
    source: ['gcp'],
    remediation: input.remediation || 'Follow GCP security best practices to remediate this finding.',
  };
}
