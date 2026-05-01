import { Module } from '@nestjs/common';
import { PlanTasksController } from './plan-tasks.controller';
import { PlanTasksService } from './plan-tasks.service';

@Module({
  controllers: [PlanTasksController],
  providers: [PlanTasksService],
})
export class PlanTasksModule {}
