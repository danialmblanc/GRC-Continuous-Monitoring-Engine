import { ControlOutput, Finding, Evidence } from '../schemas/control.schema';
import { resolveControlStatus, calculateRiskScore } from '../engine/statusResolver';

export async function runPublicSSH(): Promise<ControlOutput> {
  const { getFirewallRules } = await import('../connectors/gcp/firewall');
  const { normalizeGcpEvidence } = await import('../engine/evidenceNormalizer');
  const { getProjectId } = await import('../connectors/gcp/auth');

  const projectId = await getProjectId();
  const rules = await getFirewallRules();
  
  const evidence: Evidence[] = rules.map(r => normalizeGcpEvidence(
    'NET-001',
    'Compute Engine',
    'compute.Firewall',
    r,
    projectId,
    `Source ranges: ${r.sourceRanges.join(', ')}`
  ));

  const findings: Finding[] = [];
  rules.forEach(r => {
    const allowsSSH = r.allowed?.some(a => a.ports?.includes('22')) || r.allowed?.some(a => a.IPProtocol === 'all');
    const isPublic = r.sourceRanges.includes('0.0.0.0/0');
    
    if (allowsSSH && isPublic && !r.disabled && r.direction === 'INGRESS') {
      findings.push({
        finding_id: `find-NET-001-${r.id}`,
        severity: "critical",
        title: "Public SSH Open",
        description: `Firewall rule ${r.name} allows SSH access from 0.0.0.0/0.`,
        resource: r.name,
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString(),
        resolved: false,
        days_open: 0,
        recommended_fix: "Restrict SSH access to specific trusted IP ranges or use IAP."
      });
    }
  });

  return {
    control_id: "NET-001",
    control_name: "Denial of Public SSH",
    category: "Network Security",
    status: resolveControlStatus(findings, evidence.length),
    last_checked: new Date().toISOString(),
    risk_score: calculateRiskScore(findings),
    evidence_summary: `${rules.length} firewall rules evaluated.`,
    evidence,
    findings,
    data_source: ["gcp"],
    gcp_services_used: ["Compute Engine"],
    is_directly_measurable: true,
    limitations: [],
    recommended_remediation: ["Remove 0.0.0.0/0 from firewall rules allowing port 22."],
    framework_mappings: {
      soc2: ["CC6.6"],
      iso27001: ["A.8.20"],
      hipaa: ["164.312(a)(1)"]
    }
  };
}
