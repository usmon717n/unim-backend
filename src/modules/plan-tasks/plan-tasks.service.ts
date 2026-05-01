import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PlanTask } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlanTaskDto } from './dto/create-plan-task.dto';
import { QueryPlanTasksDto } from './dto/query-plan-tasks.dto';
import { UpdatePlanTaskDto } from './dto/update-plan-task.dto';
import { RepeatType } from './enums/plan-task.enums';

@Injectable()
export class PlanTasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreatePlanTaskDto) {
    const parsedDate = this.parseDate(dto.date);
    await this.assertNoTimeConflict(userId, parsedDate, dto.scheduledTime);

    try {
      return await this.prisma.planTask.create({
        data: {
          userId,
          title: dto.title,
          description: dto.description,
          type: dto.type,
          icon: dto.icon,
          color: dto.color,
          scheduledTime: dto.scheduledTime,
          date: parsedDate,
          repeatType: dto.repeatType ?? RepeatType.NONE,
          reminderEnabled: dto.reminderEnabled ?? false,
          reminderTime: dto.reminderTime,
        },
      });
    } catch (error) {
      this.rethrowUniqueTimeConflict(error);
      throw error;
    }
  }

  async findAll(userId: string, query: QueryPlanTasksDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.PlanTaskWhereInput = {
      userId,
      ...(query.type ? { type: query.type } : {}),
      ...(typeof query.isCompleted === 'boolean' ? { isCompleted: query.isCompleted } : {}),
      ...(query.date
        ? {
            date: {
              gte: this.startOfDay(this.parseDate(query.date)),
              lt: this.endOfDay(this.parseDate(query.date)),
            },
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.planTask.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ date: 'asc' }, { scheduledTime: 'asc' }],
      }),
      this.prisma.planTask.count({ where }),
    ]);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      items,
    };
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.planTask.findFirst({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException('Reja topilmadi');
    }
    return task;
  }

  async update(userId: string, id: string, dto: UpdatePlanTaskDto) {
    const current = await this.findOne(userId, id);
    const nextDate = dto.date !== undefined ? this.parseDate(dto.date) : current.date;
    const nextScheduledTime = dto.scheduledTime ?? current.scheduledTime;
    await this.assertNoTimeConflict(userId, nextDate, nextScheduledTime, id);

    try {
      return await this.prisma.planTask.update({
        where: { id },
        data: {
          ...(dto.title !== undefined ? { title: dto.title } : {}),
          ...(dto.description !== undefined ? { description: dto.description } : {}),
          ...(dto.type !== undefined ? { type: dto.type } : {}),
          ...(dto.icon !== undefined ? { icon: dto.icon } : {}),
          ...(dto.color !== undefined ? { color: dto.color } : {}),
          ...(dto.scheduledTime !== undefined ? { scheduledTime: dto.scheduledTime } : {}),
          ...(dto.date !== undefined ? { date: nextDate } : {}),
          ...(dto.repeatType !== undefined ? { repeatType: dto.repeatType } : {}),
          ...(dto.reminderEnabled !== undefined ? { reminderEnabled: dto.reminderEnabled } : {}),
          ...(dto.reminderTime !== undefined ? { reminderTime: dto.reminderTime } : {}),
        },
      });
    } catch (error) {
      this.rethrowUniqueTimeConflict(error);
      throw error;
    }
  }

  async complete(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.planTask.update({
      where: { id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
      },
    });
  }

  async uncomplete(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.planTask.update({
      where: { id },
      data: {
        isCompleted: false,
        completedAt: null,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.planTask.delete({ where: { id } });
    return { message: 'Reja o\'chirildi' };
  }

  async getTodayTasks(userId: string) {
    const today = new Date();
    const dayStart = this.startOfDay(today);
    const dayEnd = this.endOfDay(today);

    const candidates = await this.prisma.planTask.findMany({
      where: {
        userId,
        OR: [
          { repeatType: RepeatType.DAILY },
          { repeatType: RepeatType.WEEKLY },
          { repeatType: RepeatType.MONTHLY },
          {
            repeatType: RepeatType.NONE,
            date: {
              gte: dayStart,
              lt: dayEnd,
            },
          },
        ],
      },
      orderBy: [{ scheduledTime: 'asc' }, { createdAt: 'asc' }],
    });

    const todayTasks = candidates.filter((task) => this.shouldAppearToday(task, today));
    const progress = this.calculateProgress(todayTasks);

    return {
      progress,
      tasks: todayTasks.map((task) => ({
        id: task.id,
        title: task.title,
        type: task.type,
        icon: task.icon,
        color: task.color,
        scheduledTime: task.scheduledTime,
        isCompleted: task.isCompleted,
        completedAt: task.completedAt,
      })),
    };
  }

  async getTodayProgress(userId: string) {
    const todayData = await this.getTodayTasks(userId);
    return {
      progress: todayData.progress,
      completedCount: todayData.tasks.filter((task) => task.isCompleted).length,
      totalCount: todayData.tasks.length,
    };
  }

  private shouldAppearToday(task: PlanTask, today: Date): boolean {
    if (task.repeatType === RepeatType.DAILY) {
      return true;
    }

    if (task.repeatType === RepeatType.WEEKLY) {
      return task.date.getDay() === today.getDay();
    }

    if (task.repeatType === RepeatType.MONTHLY) {
      return task.date.getDate() === today.getDate();
    }

    const taskDate = this.startOfDay(task.date).getTime();
    return taskDate === this.startOfDay(today).getTime();
  }

  private calculateProgress(tasks: Array<{ isCompleted: boolean }>): number {
    if (tasks.length === 0) {
      return 0;
    }

    const completedCount = tasks.filter((task) => task.isCompleted).length;
    return Math.round((completedCount / tasks.length) * 100);
  }

  private parseDate(dateValue: string): Date {
    return new Date(`${dateValue}T00:00:00.000Z`);
  }

  private async assertNoTimeConflict(
    userId: string,
    date: Date,
    scheduledTime: string,
    excludeId?: string,
  ): Promise<void> {
    const conflict = await this.prisma.planTask.findFirst({
      where: {
        userId,
        date,
        scheduledTime,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (conflict) {
      throw new ConflictException('Ushbu sana va vaqtda allaqachon reja mavjud');
    }
  }

  private rethrowUniqueTimeConflict(error: unknown): void {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException('Ushbu sana va vaqtda allaqachon reja mavjud');
    }
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  private endOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0);
  }
}
