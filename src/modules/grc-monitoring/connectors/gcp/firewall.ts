import { DEMO_MODE, getProjectId } from './auth';

export async function getFirewallRules() {
  if (DEMO_MODE) {
    return [
      { 
        name: 'allow-ssh-all', 
        id: 'fw1',
        direction: 'INGRESS',
        allowed: [{ IPProtocol: 'tcp', ports: ['22'] }],
        sourceRanges: ['0.0.0.0/0'],
        disabled: false
      },
      { 
        name: 'allow-http', 
        id: 'fw2',
        direction: 'INGRESS',
        allowed: [{ IPProtocol: 'tcp', ports: ['80'] }],
        sourceRanges: ['0.0.0.0/0'],
        disabled: false
      }
    ];
  }
  
  // Real implementation would use @google-cloud/compute
  return [];
}
