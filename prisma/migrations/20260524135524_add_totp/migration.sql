/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `TeamMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "passwordHash",
ADD COLUMN     "totpEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totpSecret" TEXT;
