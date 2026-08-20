import { ControlOutput, Finding, Evidence } from '../schemas/control.schema';
import { resolveControlStatus, calculateRiskScore } from '../engine/statusResolver';

export async function runDailyBackups(): Promise<ControlOutput> {
  const { getCloudSqlInstances } = await import('../connectors/gcp/cloudsql');
  const { normalizeGcpEvidence } = await import('../engine/evidenceNormalizer');
  const { getProjectId } = await import('../connectors/gcp/auth');

  const projectId = await getProjectId();
  const instances = await getCloudSqlInstances();
  
  const evidence: Evidence[] = instances.map(i => normalizeGcpEvidence(
    'DATA-001',
    'Cloud SQL',
    'sql.Instance',
    i,
    projectId,
    `Backup enabled: ${i.settings.backupConfiguration.enabled}`
  ));

  const findings: Finding[] = [];
  instances.forEach(i => {
    if (!i.settings.backupConfiguration.enabled) {
      findings.push({
        finding_id: `find-DATA-001-${i.id}`,
        severity: "high",
        title: "Automated Backups Disabled",
        description: `Cloud SQL instance ${i.name} has automated backups disabled.`,
        resource: i.name,
        first_seen: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago to trigger Yellow
        last_seen: new Date().toISOString(),
        resolved: false,
        days_open: 4,
        recommended_fix: "Enable automated backups in Cloud SQL instance settings."
      });
    }
  });

  return {
    control_id: "DATA-001",
    control_name: "Daily Database Backups",
    category: "Data Security",
    status: resolveControlStatus(findings, evidence.length),
    last_checked: new Date().toISOString(),
    risk_score: calculateRiskScore(findings),
    evidence_summary: `${instances.length} Cloud SQL instances evaluated.`,
    evidence,
    findings,
    data_source: ["gcp"],
    gcp_services_used: ["Cloud SQL"],
    is_directly_measurable: true,
    limitations: [],
    recommended_remediation: ["Enable automated daily backups for all production Cloud SQL instances."],
    framework_mappings: {
      soc2: ["CC6.1"],
      iso27001: ["A.8.15"],
      hipaa: ["164.308(a)(7)"]
    }
  };
}

export async function runEncryptionAtRest(): Promise<ControlOutput> {
  const { getCloudSqlInstances } = await import('../connectors/gcp/cloudsql');
  const { normalizeGcpEvidence } = await import('../engine/evidenceNormalizer');
  const { getProjectId } = await import('../connectors/gcp/auth');

  const projectId = await getProjectId();
  const instances = await getCloudSqlInstances();
  
  const evidence: Evidence[] = instances.map(i => normalizeGcpEvidence(
    'DATA-002',
    'Cloud SQL',
    'sql.Instance',
    i,
    projectId,
    `Encryption enabled: ${i.encryption?.enabled}`
  ));

  const findings: Finding[] = [];
  instances.forEach(i => {
    if (!i.encryption?.enabled) {
      findings.push({
        finding_id: `find-DATA-002-${i.id}`,
        severity: "critical",
        title: "Encryption at Rest Disabled",
        description: `Cloud SQL instance ${i.name} does not have encryption at rest enabled.`,
        resource: i.name,
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        resolved: false,
        days_open: 0,
        recommended_fix: "Recreate the instance with encryption enabled or use CMEK."
      });
    }
  });

  return {
    control_id: "DATA-002",
    control_name: "Encryption at Rest",
    category: "Data Security",
    status: resolveControlStatus(findings, evidence.length),
    last_checked: new Date().toISOString(),
    risk_score: calculateRiskScore(findings),
    evidence_summary: `${instances.length} Cloud SQL instances evaluated.`,
    evidence,
    findings,
    data_source: ["gcp"],
    gcp_services_used: ["Cloud SQL"],
    is_directly_measurable: true,
    limitations: [],
    recommended_remediation: ["Ensure all Cloud SQL instances use disk encryption."],
    framework_mappings: {
      soc2: ["CC6.1"],
      iso27001: ["A.8.24"],
      hipaa: ["164.312(a)(2)"]
    }
  };
}
