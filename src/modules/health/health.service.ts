import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LogMetricDto, MetricType } from './dto/log-metric.dto';
import {
  HealthSummaryResponse,
  HeartRateStatus,
  HistoryPoint,
  SleepStatus,
  StepsStatus,
} from './interfaces/health.interface';

const STEPS_GOAL = 10_000;
const SLEEP_GOAL = 7; // hours

const METRIC_RANGES: Record<MetricType, [number, number]> = {
  [MetricType.HEART_RATE]: [30, 250],
  [MetricType.STEPS]: [0, 100_000],
  [MetricType.SLEEP]: [0, 24],
};

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Write ──────────────────────────────────────────────────────────────────

  async logMetric(userId: string, dto: LogMetricDto) {
    const [min, max] = METRIC_RANGES[dto.type];
    if (dto.value < min || dto.value > max) {
      throw new BadRequestException(
        `${dto.type} qiymati ${min}–${max} oralig'ida bo'lishi kerak`,
      );
    }

    return this.prisma.healthMetric.create({
      data: {
        userId,
        type: dto.type,
        value: dto.value,
        metadata: dto.metadata as Prisma.InputJsonValue | undefined,
        recordedAt: dto.recordedAt ? new Date(dto.recordedAt) : new Date(),
        source: 'MANUAL',
      },
      select: { id: true, type: true, value: true, recordedAt: true, source: true },
    });
  }

  // ── Summary ────────────────────────────────────────────────────────────────

  async getSummary(userId: string): Promise<HealthSummaryResponse> {
    const [latestHR, latestSteps, latestSleep, weeklyHRAvg] = await Promise.all([
      this.getLatest(userId, MetricType.HEART_RATE),
      this.getLatestToday(userId, MetricType.STEPS),
      this.getLatest(userId, MetricType.SLEEP),
      this.getWeeklyAvg(userId, MetricType.HEART_RATE),
    ]);

    return {
      heartRate: latestHR
        ? {
            value: Math.round(latestHR.value),
            status: this.heartRateStatus(latestHR.value),
            weeklyAvg: weeklyHRAvg,
            recordedAt: latestHR.recordedAt.toISOString(),
          }
        : null,

      steps: latestSteps
        ? {
            value: Math.round(latestSteps.value),
            goal: STEPS_GOAL,
            progress: parseFloat(
              Math.min((latestSteps.value / STEPS_GOAL) * 100, 100).toFixed(1),
            ),
            calories: Math.round(latestSteps.value * 0.04),
            distanceKm: parseFloat((latestSteps.value * 0.000762).toFixed(2)),
            status: this.stepsStatus(latestSteps.value),
            recordedAt: latestSteps.recordedAt.toISOString(),
          }
        : null,

      sleep: latestSleep
        ? {
            value: parseFloat(latestSleep.value.toFixed(1)),
            status: this.sleepStatus(latestSleep.value),
            qualityScore: this.sleepQualityScore(latestSleep.value),
            sleepDebt: parseFloat(
              Math.max(0, SLEEP_GOAL - latestSleep.value).toFixed(1),
            ),
            recordedAt: latestSleep.recordedAt.toISOString(),
          }
        : null,
    };
  }

  // ── History ────────────────────────────────────────────────────────────────

  async getHistory(userId: string, type: MetricType, days: number): Promise<HistoryPoint[]> {
    const from = new Date();
    from.setDate(from.getDate() - Math.max(1, Math.min(days, 90)));
    from.setHours(0, 0, 0, 0);

    const records = await this.prisma.healthMetric.findMany({
      where: { userId, type, recordedAt: { gte: from } },
      orderBy: { recordedAt: 'asc' },
      select: { value: true, recordedAt: true },
    });

    return records.map((r) => ({
      value: r.value,
      recordedAt: r.recordedAt.toISOString(),
    }));
  }

  // ── Prisma helpers ─────────────────────────────────────────────────────────

  private getLatest(userId: string, type: MetricType) {
    return this.prisma.healthMetric.findFirst({
      where: { userId, type },
      orderBy: { recordedAt: 'desc' },
    });
  }

  private getLatestToday(userId: string, type: MetricType) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.healthMetric.findFirst({
      where: { userId, type, recordedAt: { gte: today, lt: tomorrow } },
      orderBy: { recordedAt: 'desc' },
    });
  }

  private async getWeeklyAvg(userId: string, type: MetricType): Promise<number | null> {
    const from = new Date();
    from.setDate(from.getDate() - 7);

    const agg = await this.prisma.healthMetric.aggregate({
      where: { userId, type, recordedAt: { gte: from } },
      _avg: { value: true },
    });

    return agg._avg.value !== null
      ? parseFloat(agg._avg.value.toFixed(1))
      : null;
  }

  // ── Business logic ─────────────────────────────────────────────────────────

  private heartRateStatus(bpm: number): HeartRateStatus {
    if (bpm < 60) return 'low';
    if (bpm > 100) return 'high';
    return 'normal';
  }

  private stepsStatus(steps: number): StepsStatus {
    if (steps >= STEPS_GOAL) return 'exceeded';
    if (steps >= STEPS_GOAL * 0.5) return 'on_track';
    return 'behind';
  }

  private sleepStatus(hours: number): SleepStatus {
    if (hours < 6) return 'short';
    if (hours > 9) return 'long';
    return 'good';
  }

  private sleepQualityScore(hours: number): number {
    // Duration contributes 60 pts: peak at 7.5 h (both under & over penalised)
    const durationScore = Math.max(0, 60 - Math.abs(hours - 7.5) * 12);
    // Regularity bonus: flat 40 pts if within healthy range
    const regularityScore = hours >= 6 && hours <= 9 ? 40 : hours >= 5 && hours <= 10 ? 20 : 0;
    return Math.round(durationScore + regularityScore);
  }
}
