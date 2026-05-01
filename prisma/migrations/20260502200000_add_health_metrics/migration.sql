-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('HEART_RATE', 'STEPS', 'SLEEP');

-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('MANUAL', 'APPLE_HEALTH', 'GOOGLE_FIT', 'SAMSUNG_HEALTH');

-- CreateTable
CREATE TABLE "health_metrics" (
    "id"          TEXT                    NOT NULL,
    "user_id"     TEXT                    NOT NULL,
    "type"        "MetricType"            NOT NULL,
    "value"       DOUBLE PRECISION        NOT NULL,
    "metadata"    JSONB,
    "recorded_at" TIMESTAMP(3)            NOT NULL,
    "source"      "DataSource"            NOT NULL DEFAULT 'MANUAL',
    "created_at"  TIMESTAMP(3)            NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "health_metrics_user_id_type_recorded_at_idx"
    ON "health_metrics"("user_id", "type", "recorded_at");

-- AddForeignKey
ALTER TABLE "health_metrics"
    ADD CONSTRAINT "health_metrics_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
