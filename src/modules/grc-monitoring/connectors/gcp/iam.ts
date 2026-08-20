import { DEMO_MODE } from '../../types';

// Mock GCP IAM Connector
export async function getIAMUsers() {
  if (DEMO_MODE) {
    return [
      { email: 'admin@company.com', roles: ['roles/owner'], mfaEnabled: true },
      { email: 'dev-1@company.com', roles: ['roles/editor'], mfaEnabled: true },
      { email: 'contractor@gmail.com', roles: ['roles/viewer'], mfaEnabled: false },
    ];
  }
  // Real implementation would use @google-cloud/iam
  return [];
}

export async function getIAMPolicy() {
  if (DEMO_MODE) {
    return {
      bindings: [
        { role: 'roles/owner', members: ['user:admin@company.com'] },
        { role: 'roles/editor', members: ['user:dev-1@company.com'] },
      ]
    };
  }
  return { bindings: [] };
}
