/**
 * Performance Engine Logger (SPR-306)
 */

export interface PerformanceLogEntry {
  userId: string;
  durationMs: number;
  overallScore: number;
  snapshotCreated: boolean;
  snapshotId?: string;
  error?: string;
}

export function logPerformanceCalculation(entry: PerformanceLogEntry): void {
  if (entry.error) {
    console.error(
      `[PERFORMANCE ENGINE ERROR] userId=${entry.userId} duration=${entry.durationMs}ms error="${entry.error}"`
    );
  } else {
    console.log(
      `[PERFORMANCE ENGINE] userId=${entry.userId} score=${entry.overallScore} snapshot=${entry.snapshotCreated} snapshotId=${entry.snapshotId || 'none'} duration=${entry.durationMs}ms`
    );
  }
}
