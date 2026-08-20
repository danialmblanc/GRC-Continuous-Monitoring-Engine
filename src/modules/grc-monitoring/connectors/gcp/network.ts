import { DEMO_MODE } from '../../types';

export async function getFirewallRules() {
  if (DEMO_MODE) {
    return {
      rules: [
        { name: 'allow-http', direction: 'INGRESS', allowed: [{ IPProtocol: 'tcp', ports: ['80'] }], sourceRanges: ['0.0.0.0/0'] },
        { name: 'allow-ssh', direction: 'INGRESS', allowed: [{ IPProtocol: 'tcp', ports: ['22'] }], sourceRanges: ['0.0.0.0/0'] },
      ]
    };
  }
  return { rules: [] };
}
