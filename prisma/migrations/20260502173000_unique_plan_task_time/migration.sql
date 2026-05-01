-- CreateIndex
CREATE UNIQUE INDEX "plan_tasks_user_id_date_scheduled_time_key" ON "plan_tasks"("user_id", "date", "scheduled_time");
