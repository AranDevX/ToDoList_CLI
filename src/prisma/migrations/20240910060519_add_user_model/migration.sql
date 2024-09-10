/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `soft_delete` on table `lists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `completed` on table `tasks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `soft_delete` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "lists" ALTER COLUMN "soft_delete" SET NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "completed" SET NOT NULL,
ALTER COLUMN "soft_delete" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
