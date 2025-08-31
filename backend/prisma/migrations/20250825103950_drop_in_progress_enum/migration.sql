/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `EvaluationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [IN_PROGRESS] on the enum `QueueStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EvaluationStatus_new" AS ENUM ('PENDING', 'COMPLETED');
ALTER TABLE "public"."Evaluation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Evaluation" ALTER COLUMN "status" TYPE "public"."EvaluationStatus_new" USING ("status"::text::"public"."EvaluationStatus_new");
ALTER TYPE "public"."EvaluationStatus" RENAME TO "EvaluationStatus_old";
ALTER TYPE "public"."EvaluationStatus_new" RENAME TO "EvaluationStatus";
DROP TYPE "public"."EvaluationStatus_old";
ALTER TABLE "public"."Evaluation" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."QueueStatus_new" AS ENUM ('WAITING', 'RESOLVED', 'CANCELLED');
ALTER TABLE "public"."MentorshipQueue" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."MentorshipQueue" ALTER COLUMN "status" TYPE "public"."QueueStatus_new" USING ("status"::text::"public"."QueueStatus_new");
ALTER TYPE "public"."QueueStatus" RENAME TO "QueueStatus_old";
ALTER TYPE "public"."QueueStatus_new" RENAME TO "QueueStatus";
DROP TYPE "public"."QueueStatus_old";
ALTER TABLE "public"."MentorshipQueue" ALTER COLUMN "status" SET DEFAULT 'WAITING';
COMMIT;
