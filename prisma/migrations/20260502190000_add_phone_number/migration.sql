-- AlterTable: make email nullable (existing rows keep their values)
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable: make name nullable
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable: add phone_number column (nullable, unique)
ALTER TABLE "users" ADD COLUMN "phone_number" TEXT;

-- CreateIndex: unique constraint on phone_number
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");
