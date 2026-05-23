/*
  Warnings:

  - A unique constraint covering the columns `[employeeCode]` on the table `TeamMember` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "employeeCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_employeeCode_key" ON "TeamMember"("employeeCode");
