import { DEMO_MODE, getProjectId } from './auth';
import { Storage } from '@google-cloud/storage';

export async function getStorageBuckets() {
  if (DEMO_MODE) {
    return [
      { name: 'public-assets', publicAccess: true, uniformAccess: true, id: 'b1' },
      { name: 'customer-data', publicAccess: false, uniformAccess: true, id: 'b2' },
      { name: 'internal-logs', publicAccess: false, uniformAccess: false, id: 'b3' },
    ];
  }

  const projectId = await getProjectId();
  const storage = new Storage({ projectId });
  const [buckets] = await storage.getBuckets();
  
  return buckets.map(b => ({
    name: b.name,
    id: b.id,
    publicAccess: b.metadata.iamConfiguration?.publicAccessPrevention === 'enforced' ? false : true,
    uniformAccess: (b.metadata.iamConfiguration as any)?.uniformBucketLevelAccess?.enabled || (b.metadata.iamConfiguration as any)?.bucketPolicyOnly?.enabled || false,
    raw: b.metadata
  }));
}
