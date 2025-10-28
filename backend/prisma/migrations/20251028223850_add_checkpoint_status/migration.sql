/*
  Warnings:

  - Changed the type of `status` on the `TeamCheckpoint` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CheckpointStatus" AS ENUM ('COMPLETED', 'PARTIALLY_COMPLETED');

-- AlterTable
ALTER TABLE "TeamCheckpoint" DROP COLUMN "status",
ADD COLUMN     "status" "CheckpointStatus" NOT NULL;
