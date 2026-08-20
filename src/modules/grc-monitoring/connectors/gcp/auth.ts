import { GoogleAuth } from 'google-auth-library';

export const DEMO_MODE = process.env.DEMO_MODE === "true" || !process.env.GOOGLE_APPLICATION_CREDENTIALS;

export async function getGcpAuth() {
  if (DEMO_MODE) {
    return null;
  }
  
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  
  return auth;
}

export async function getProjectId() {
  if (DEMO_MODE) return "demo-project-123";
  
  const auth = await getGcpAuth();
  if (!auth) return "demo-project-123";
  
  const projectId = await auth.getProjectId();
  return projectId;
}
