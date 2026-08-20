import { Type } from "@google/genai";

export const grcToolDefinitions = [
  {
    name: "run_gcp_grc_control",
    description: "Run a specific GRC monitoring control using GCP evidence and return the status and findings.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        control_id: { 
          type: Type.STRING,
          description: "The ID of the control to run (e.g., DATA-001, NET-001, INFRA-001)."
        }
      },
      required: ["control_id"]
    }
  },
  {
    name: "get_grc_posture_summary",
    description: "Fetch a summary of the current compliance posture across all categories.",
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: "run_all_grc_controls",
    description: "Run all GRC monitoring controls and return the full results.",
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  }
];
