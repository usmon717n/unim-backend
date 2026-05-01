import { PartialType } from '@nestjs/swagger';
import { CreatePlanTaskDto } from './create-plan-task.dto';

export class UpdatePlanTaskDto extends PartialType(CreatePlanTaskDto) {}
