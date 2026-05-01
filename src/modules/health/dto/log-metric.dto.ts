import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MetricType {
  HEART_RATE = 'HEART_RATE',
  STEPS = 'STEPS',
  SLEEP = 'SLEEP',
}

export class LogMetricDto {
  @ApiProperty({
    enum: MetricType,
    description: 'HEART_RATE → bpm, STEPS → kun davomida qadam soni, SLEEP → soat',
  })
  @IsEnum(MetricType, { message: 'Noto\'g\'ri metrika turi' })
  type!: MetricType;

  @ApiProperty({
    example: 72,
    description: 'HEART_RATE: 30–250 bpm | STEPS: 0–100 000 | SLEEP: 0–24 soat',
  })
  @IsNumber({}, { message: 'Qiymat raqam bo\'lishi kerak' })
  @Min(0)
  value!: number;

  @ApiPropertyOptional({
    example: '2026-05-02T10:30:00.000Z',
    description: 'Belgilanmasa server vaqti ishlatiladi',
  })
  @IsISO8601({}, { message: 'Vaqt ISO 8601 formatida bo\'lishi kerak' })
  @IsOptional()
  recordedAt?: string;

  @ApiPropertyOptional({
    description: 'SLEEP: { bedtime: "23:30", wakeTime: "06:30" }',
    example: { bedtime: '23:30', wakeTime: '06:30' },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
