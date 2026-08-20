import { ControlOutput, Finding, Evidence } from '../schemas/control.schema';
import { resolveControlStatus, calculateRiskScore } from '../engine/statusResolver';

export async function runMfaOnAccounts(): Promise<ControlOutput> {
  const { getProjectId } = await import('../connectors/gcp/auth');
  const projectId = await getProjectId();

  // Inferred evidence from IAM policy or SCC identity findings
  const evidence: Evidence[] = [];
  const findings: Finding[] = [];

  return {
    control_id: "PROD-001",
    control_name: "MFA on Accounts",
    category: "Product Security",
    status: "unknown",
    last_checked: new Date().toISOString(),
    risk_score: 0,
    evidence_summary: "Not directly evidenced from GCP-only telemetry without Cloud Identity API access.",
    evidence,
    findings,
    data_source: ["gcp"],
    gcp_services_used: ["IAM"],
    is_directly_measurable: false,
    limitations: ["Requires Cloud Identity API or Google Workspace integration for full MFA evidence."],
    recommended_remediation: ["Enforce MFA for all administrative users in the Google Cloud Console."],
    framework_mappings: {
      soc2: ["CC6.1"],
      iso27001: ["A.9.4.2"],
      hipaa: ["164.312(a)(2)(i)"]
    }
  };
}

export async function runMultiAz(): Promise<ControlOutput> {
  const { getCloudSqlInstances } = await import('../connectors/gcp/cloudsql');
  const { normalizeGcpEvidence } = await import('../engine/evidenceNormalizer');
  const { getProjectId } = await import('../connectors/gcp/auth');

  const projectId = await getProjectId();
  const instances = await getCloudSqlInstances();
  
  const evidence: Evidence[] = instances.map(i => normalizeGcpEvidence(
    'INFRA-002',
    'Cloud SQL',
    'sql.Instance',
    i,
    projectId,
    `Availability type: ${i.settings.availabilityType || 'ZONAL'}`
  ));

  const findings: Finding[] = [];
  instances.forEach(i => {
    if (i.settings.availabilityType !== 'REGIONAL') {
      findings.push({
        finding_id: `find-INFRA-002-${i.id}`,
        severity: "medium",
        title: "Single-Zone Database",
        description: `Cloud SQL instance ${i.name} is deployed in a single zone.`,
        resource: i.name,
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        resolved: false,
        days_open: 0,
        recommended_fix: "Enable High Availability (Regional deployment) for the instance."
      });
    }
  });

  return {
    control_id: "INFRA-002",
    control_name: "Multiple Availability Zones",
    category: "Infrastructure Security",
    status: resolveControlStatus(findings, evidence.length),
    last_checked: new Date().toISOString(),
    risk_score: calculateRiskScore(findings),
    evidence_summary: `${instances.length} Cloud SQL instances evaluated for HA.`,
    evidence,
    findings,
    data_source: ["gcp"],
    gcp_services_used: ["Cloud SQL"],
    is_directly_measurable: true,
    limitations: [],
    recommended_remediation: ["Deploy critical production databases in High Availability mode."],
    framework_mappings: {
      soc2: ["CC7.5"],
      iso27001: ["A.17.1.1"],
      hipaa: ["164.308(a)(7)(ii)(C)"]
    }
  };
}
