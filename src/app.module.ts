import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { PlanTasksModule } from './modules/plan-tasks/plan-tasks.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, AccountModule, PlanTasksModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
