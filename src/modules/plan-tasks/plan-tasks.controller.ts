import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { SafeUser } from '../users/interfaces/user.interface';
import { CreatePlanTaskDto } from './dto/create-plan-task.dto';
import { QueryPlanTasksDto } from './dto/query-plan-tasks.dto';
import { UpdatePlanTaskDto } from './dto/update-plan-task.dto';
import { PlanTasksService } from './plan-tasks.service';

@ApiTags('Plan Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plan-tasks')
export class PlanTasksController {
  constructor(private readonly planTasksService: PlanTasksService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi reja qo\'shish' })
  create(@CurrentUser() user: SafeUser, @Body() dto: CreatePlanTaskDto) {
    return this.planTasksService.create(user.id, dto);
  }

  @Get('today')
  @ApiOperation({ summary: 'Bugungi rejalarni progress bilan olish' })
  getToday(@CurrentUser() user: SafeUser) {
    return this.planTasksService.getTodayTasks(user.id);
  }

  @Get('progress/today')
  @ApiOperation({ summary: 'Bugungi progress foizini olish' })
  getTodayProgress(@CurrentUser() user: SafeUser) {
    return this.planTasksService.getTodayProgress(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha rejalar (pagination + filter)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'isCompleted', required: false, type: Boolean })
  @ApiQuery({ name: 'date', required: false, description: 'YYYY-MM-DD' })
  findAll(@CurrentUser() user: SafeUser, @Query() query: QueryPlanTasksDto) {
    return this.planTasksService.findAll(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta rejani olish' })
  @ApiParam({ name: 'id' })
  findOne(@CurrentUser() user: SafeUser, @Param('id') id: string) {
    return this.planTasksService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rejani tahrirlash' })
  update(
    @CurrentUser() user: SafeUser,
    @Param('id') id: string,
    @Body() dto: UpdatePlanTaskDto,
  ) {
    return this.planTasksService.update(user.id, id, dto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Rejani bajarildi qilish' })
  complete(@CurrentUser() user: SafeUser, @Param('id') id: string) {
    return this.planTasksService.complete(user.id, id);
  }

  @Patch(':id/uncomplete')
  @ApiOperation({ summary: 'Rejani bajarilmagan qilish' })
  uncomplete(@CurrentUser() user: SafeUser, @Param('id') id: string) {
    return this.planTasksService.uncomplete(user.id, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Rejani o\'chirish' })
  remove(@CurrentUser() user: SafeUser, @Param('id') id: string) {
    return this.planTasksService.remove(user.id, id);
  }
}
