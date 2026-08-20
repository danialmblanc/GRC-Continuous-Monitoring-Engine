import * as data from './data-security';
import * as network from './network-security';
import * as infra from './infrastructure-security';
import * as product from './product-security';
import * as org from './organization-security';
import * as app from './app-security';
import { ControlOutput } from '../schemas/control.schema';

export const allControls: Record<string, () => Promise<ControlOutput>> = {
  "DATA-001": data.runDailyBackups,
  "DATA-002": data.runEncryptionAtRest,
  "NET-001": network.runPublicSSH,
  "INFRA-001": infra.runStorageRestrictions,
  "INFRA-002": product.runMultiAz,
  "PROD-001": product.runMfaOnAccounts,
  "ORG-001": org.runIncidentResponsePlan,
  "ORG-002": org.runSecurityTraining,
  "ORG-003": org.runDisasterRecoveryPlan,
  "APP-001": app.runCodeReviewProcess,
  "APP-002": app.runWaf,
};

export async function runAllControls(): Promise<ControlOutput[]> {
  const results = await Promise.all(Object.values(allControls).map(fn => fn()));
  return results;
}
