import { ControlOutput, ControlStatus, Finding } from '../schemas/control.schema';
import { differenceInDays } from 'date-fns';

/**
 * Centralized status logic engine:
 * Green = a control is passing all tests
 * Yellow = a control has a failed test that has not been resolved within the past 3 days
 * Red = a critical control failure exists
 * Gray = no evidence available / not yet evaluated
 */
export function resolveControlStatus(findings: Finding[], evidenceCount: number): ControlStatus {
  if (evidenceCount === 0) return "unknown"; // Gray

  const activeFindings = findings.filter(f => !f.resolved);
  if (activeFindings.length === 0) return "pass"; // Green

  const criticalFailure = activeFindings.some(f => f.severity === "critical");
  if (criticalFailure) return "fail"; // Red

  const staleFailure = activeFindings.some(f => {
    const daysOpen = differenceInDays(new Date(), new Date(f.first_seen));
    return daysOpen >= 3;
  });

  if (staleFailure) return "warning"; // Yellow

  // If there are active findings but not critical and not yet 3 days old,
  // it might still be "fail" if it's a direct failure, or "warning".
  // The user requirement says:
  // "Green = passing all tests"
  // "Yellow = failed test not resolved within 3 days"
  // "Red = critical failure exists"
  // "Gray = no evidence"
  // What about a non-critical failure that is < 3 days old?
  // Usually, a failure is a failure. But following the user's specific logic:
  return "fail"; // Default to Red for any failure unless it meets Yellow criteria? 
  // Actually, the user says "Red = critical control failure exists".
  // Let's refine:
  // If ANY active finding exists:
  //   If severity is critical -> Red
  //   If days_open >= 3 -> Yellow
  //   Else -> Red (or maybe Yellow if we want to be lenient, but user says Red for critical)
  // Let's stick to:
  // Critical -> Red
  // Non-critical but >= 3 days -> Yellow
  // Non-critical and < 3 days -> Red (or maybe this is also Red?)
  // Re-reading: "Yellow = failed test that has not been resolved within the past 3 days"
  // This implies if it IS resolved or < 3 days it might be something else.
  // But "Green = passing ALL tests".
  // So if it's < 3 days and failing, it's not Green.
  // Let's assume:
  // 1. No evidence -> Gray (unknown)
  // 2. No active findings -> Green (pass)
  // 3. Critical active finding -> Red (fail)
  // 4. Any active finding >= 3 days -> Yellow (warning)
  // 5. Any active finding < 3 days -> Red (fail) - because it's a failure.
}

export function calculateRiskScore(findings: Finding[]): number {
  const activeFindings = findings.filter(f => !f.resolved);
  if (activeFindings.length === 0) return 0;

  let score = 0;
  activeFindings.forEach(f => {
    switch (f.severity) {
      case "critical": score += 40; break;
      case "high": score += 25; break;
      case "medium": score += 10; break;
      case "low": score += 5; break;
    }
  });

  return Math.min(100, score);
}
