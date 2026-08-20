import { Evidence } from '../schemas/control.schema';

export function normalizeGcpEvidence(
  controlId: string,
  service: string,
  resourceType: string,
  resource: any,
  projectId: string,
  notes?: string
): Evidence {
  return {
    evidence_id: `ev-${controlId}-${resource.id || resource.name || Math.random().toString(36).substr(2, 9)}`,
    control_id: controlId,
    source: "gcp",
    service,
    resource_type: resourceType,
    resource_name: resource.name || resource.id || "unknown",
    resource_id: resource.id || resource.name || "unknown",
    project_id: projectId,
    timestamp_collected: new Date().toISOString(),
    raw_reference: resource,
    normalized_fields: {}, // To be populated by specific collectors
    confidence: "high",
    notes
  };
}
