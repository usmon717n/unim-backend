import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { PlanTaskType, RepeatType } from '../enums/plan-task.enums';

export class CreatePlanTaskDto {
  @ApiProperty({ example: 'Omega-3' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Ovqatdan keyin ichish' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: PlanTaskType, example: PlanTaskType.VITAMIN })
  @IsEnum(PlanTaskType)
  type: PlanTaskType;

  @ApiPropertyOptional({ example: 'pill' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: '#10B981' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    example: '12:00',
    description: 'HH:mm format',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  scheduledTime: string;

  @ApiProperty({
    example: '2026-05-02',
    description: 'YYYY-MM-DD format',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @ApiPropertyOptional({ enum: RepeatType, default: RepeatType.NONE })
  @IsOptional()
  @IsEnum(RepeatType)
  repeatType?: RepeatType;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  reminderEnabled?: boolean;

  @ApiPropertyOptional({
    example: '11:45',
    description: 'HH:mm format',
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  reminderTime?: string;
}
