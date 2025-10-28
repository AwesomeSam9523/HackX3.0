/*
  Warnings:

  - The values [TEAM_LEADER] on the enum `ParticipantRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `Verified` on the `TeamParticipant` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ParticipantRole_new" AS ENUM ('MEMBER', 'LEADER');
ALTER TABLE "public"."TeamParticipant"
    ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "TeamParticipant" ALTER COLUMN "role" TYPE "ParticipantRole_new" USING ("role"::text::"ParticipantRole_new");
ALTER TYPE "ParticipantRole" RENAME TO "ParticipantRole_old";
ALTER TYPE "ParticipantRole_new" RENAME TO "ParticipantRole";
DROP TYPE "public"."ParticipantRole_old";
ALTER TABLE "TeamParticipant"
    ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;

-- AlterTable
ALTER TABLE "TeamParticipant" DROP COLUMN "Verified",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
