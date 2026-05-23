/*
  Warnings:

  - Made the column `employeeCode` on table `TeamMember` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TeamMember" ALTER COLUMN "employeeCode" SET NOT NULL;
