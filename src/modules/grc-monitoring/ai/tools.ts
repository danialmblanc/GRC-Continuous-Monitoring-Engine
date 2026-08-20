import { Type } from "@google/genai";

export const grcTools = [
  {
    name: "run_control_check",
    description: "Runs a specific compliance control check and returns the result.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        control_id: {
          type: Type.STRING,
          description: "The ID of the control to check (e.g., ORG-001, DATA-001).",
        },
      },
      required: ["control_id"],
    },
  },
  {
    name: "get_compliance_dashboard",
    description: "Returns the full compliance dashboard with all control statuses.",
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
];
