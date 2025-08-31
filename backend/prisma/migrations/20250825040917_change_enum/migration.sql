/*
  Warnings:

  - The values [ROUND2_QUALIFIED] on the enum `TeamStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."TeamStatus_new" AS ENUM ('REGISTERED', 'PROBLEM_SELECTED', 'ROUND1_SUBMITTED', 'ROUND1_QUALIFIED', 'ROUND2_SUBMITTED', 'ELIMINATED');
ALTER TABLE "public"."Team" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Team" ALTER COLUMN "status" TYPE "public"."TeamStatus_new" USING ("status"::text::"public"."TeamStatus_new");
ALTER TYPE "public"."TeamStatus" RENAME TO "TeamStatus_old";
ALTER TYPE "public"."TeamStatus_new" RENAME TO "TeamStatus";
DROP TYPE "public"."TeamStatus_old";
ALTER TABLE "public"."Team" ALTER COLUMN "status" SET DEFAULT 'REGISTERED';
COMMIT;
