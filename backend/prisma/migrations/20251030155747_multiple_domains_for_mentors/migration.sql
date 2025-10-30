/*
  Warnings:

  - You are about to drop the column `domain` on the `Mentor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "domain",
ADD COLUMN     "domains" TEXT[];
