import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { SafeUser } from '../users/interfaces/user.interface';
import { LogMetricDto, MetricType } from './dto/log-metric.dto';
import { HealthService } from './health.service';

@ApiTags('Health')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post('metrics/log')
  @ApiOperation({ summary: 'Yangi sog\'liq ko\'rsatkichini saqlash' })
  @ApiResponse({ status: 201, description: 'Saqlandi' })
  @ApiResponse({ status: 400, description: 'Qiymat diapazondan tashqarida' })
  log(@CurrentUser() user: SafeUser, @Body() dto: LogMetricDto) {
    return this.healthService.logMetric(user.id, dto);
  }

  @Get('metrics/summary')
  @ApiOperation({ summary: 'Barcha 3 metrikaning so\'nggi holati + hisob-kitoblar' })
  @ApiResponse({ status: 200, description: 'Summary qaytarildi' })
  summary(@CurrentUser() user: SafeUser) {
    return this.healthService.getSummary(user.id);
  }

  @Get('metrics/:type/history')
  @ApiOperation({ summary: 'Metrika tarixi (grafik uchun)' })
  @ApiParam({
    name: 'type',
    enum: MetricType,
    description: 'HEART_RATE | STEPS | SLEEP',
  })
  @ApiQuery({ name: 'days', required: false, example: 7, description: 'Necha kun (1–90)' })
  @ApiResponse({ status: 200, description: 'Tarix ro\'yxati' })
  history(
    @CurrentUser() user: SafeUser,
    @Param('type') type: MetricType,
    @Query('days') days?: string,
  ) {
    return this.healthService.getHistory(
      user.id,
      type,
      days ? parseInt(days, 10) : 7,
    );
  }
}
