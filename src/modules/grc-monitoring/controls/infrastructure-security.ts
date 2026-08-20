import { ControlOutput, Finding, Evidence } from '../schemas/control.schema';
import { resolveControlStatus, calculateRiskScore } from '../engine/statusResolver';

export async function runStorageRestrictions(): Promise<ControlOutput> {
  const { getStorageBuckets } = await import('../connectors/gcp/storage');
  const { normalizeGcpEvidence } = await import('../engine/evidenceNormalizer');
  const { getProjectId } = await import('../connectors/gcp/auth');

  const projectId = await getProjectId();
  const buckets = await getStorageBuckets();
  
  const evidence: Evidence[] = buckets.map(b => normalizeGcpEvidence(
    'INFRA-001',
    'Cloud Storage',
    'storage.Bucket',
    b,
    projectId,
    `Public access: ${b.publicAccess}, Uniform access: ${b.uniformAccess}`
  ));

  const findings: Finding[] = [];
  buckets.forEach(b => {
    if (b.publicAccess) {
      findings.push({
        finding_id: `find-INFRA-001-${b.id}`,
        severity: "high",
        title: "Public Storage Bucket",
        description: `Storage bucket ${b.name} is publicly accessible.`,
        resource: b.name,
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        resolved: false,
        days_open: 0,
        recommended_fix: "Enable Public Access Prevention on the bucket."
      });
    }
  });

  return {
    control_id: "INFRA-001",
    control_name: "Cloud Data Storage Restricted",
    category: "Infrastructure Security",
    status: resolveControlStatus(findings, evidence.length),
    last_checked: new Date().toISOString(),
    risk_score: calculateRiskScore(findings),
    evidence_summary: `${buckets.length} storage buckets evaluated.`,
    evidence,
    findings,
    data_source: ["gcp"],
    gcp_services_used: ["Cloud Storage"],
    is_directly_measurable: true,
    limitations: [],
    recommended_remediation: ["Enforce Public Access Prevention at the project or bucket level."],
    framework_mappings: {
      soc2: ["CC6.1"],
      iso27001: ["A.8.12"],
      hipaa: ["164.312(c)(1)"]
    }
  };
}
