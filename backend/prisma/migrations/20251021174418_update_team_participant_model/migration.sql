/*
  Warnings:

  - You are about to drop the column `isPresent` on the `TeamParticipant` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `TeamParticipant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."TeamParticipant_participantId_key";

-- DropIndex
DROP INDEX "public"."TeamParticipant_teamId_participantId_key";

-- AlterTable
ALTER TABLE "TeamParticipant" DROP COLUMN "isPresent",
DROP COLUMN "participantId",
ADD COLUMN     "Verified" BOOLEAN NOT NULL DEFAULT false;
