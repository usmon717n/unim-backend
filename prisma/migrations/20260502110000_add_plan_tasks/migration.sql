-- CreateEnum
CREATE TYPE "PlanTaskType" AS ENUM ('MEDICINE', 'SPORT', 'WATER', 'VITAMIN', 'CUSTOM');

-- CreateEnum
CREATE TYPE "RepeatType" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "plan_tasks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "PlanTaskType" NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "scheduled_time" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "repeat_type" "RepeatType" NOT NULL DEFAULT 'NONE',
    "reminder_enabled" BOOLEAN NOT NULL DEFAULT false,
    "reminder_time" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "plan_tasks_user_id_idx" ON "plan_tasks"("user_id");

-- CreateIndex
CREATE INDEX "plan_tasks_user_id_date_idx" ON "plan_tasks"("user_id", "date");

-- CreateIndex
CREATE INDEX "plan_tasks_user_id_repeat_type_idx" ON "plan_tasks"("user_id", "repeat_type");

-- CreateIndex
CREATE INDEX "plan_tasks_user_id_scheduled_time_idx" ON "plan_tasks"("user_id", "scheduled_time");

-- AddForeignKey
ALTER TABLE "plan_tasks" ADD CONSTRAINT "plan_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
