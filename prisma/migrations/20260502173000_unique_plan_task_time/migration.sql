-- Existing production data may already contain duplicate plan tasks for the
-- same user/date/time. Keep the oldest row and remove duplicates before adding
-- the database-level guard.
DELETE FROM "plan_tasks"
WHERE "id" IN (
  SELECT "id"
  FROM (
    SELECT
      "id",
      ROW_NUMBER() OVER (
        PARTITION BY "user_id", "date", "scheduled_time"
        ORDER BY "created_at" ASC, "id" ASC
      ) AS "duplicate_rank"
    FROM "plan_tasks"
  ) AS "ranked_plan_tasks"
  WHERE "duplicate_rank" > 1
);

-- CreateIndex
CREATE UNIQUE INDEX "plan_tasks_user_id_date_scheduled_time_key" ON "plan_tasks"("user_id", "date", "scheduled_time");
