export type HeartRateStatus = 'low' | 'normal' | 'high';
export type StepsStatus = 'behind' | 'on_track' | 'exceeded';
export type SleepStatus = 'short' | 'good' | 'long';

export interface HeartRateSummary {
  value: number;       // bpm
  status: HeartRateStatus;
  weeklyAvg: number | null;
  recordedAt: string;
}

export interface StepsSummary {
  value: number;       // today's step count
  goal: number;        // 10 000
  progress: number;    // 0–100 %
  calories: number;    // kcal
  distanceKm: number;
  status: StepsStatus;
  recordedAt: string;
}

export interface SleepSummary {
  value: number;       // hours
  status: SleepStatus;
  qualityScore: number; // 0–100
  sleepDebt: number;   // hours under 7 h goal (0 if good)
  recordedAt: string;
}

export interface HealthSummaryResponse {
  heartRate: HeartRateSummary | null;
  steps: StepsSummary | null;
  sleep: SleepSummary | null;
}

export interface HistoryPoint {
  value: number;
  recordedAt: string;
}
