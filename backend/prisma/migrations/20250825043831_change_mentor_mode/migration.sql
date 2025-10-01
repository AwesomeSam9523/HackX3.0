/*
  Warnings:

  - The values [IN_PERSON] on the enum `MentorMode` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."MentorMode_new" AS ENUM ('ONLINE', 'OFFLINE');
ALTER TABLE "public"."Mentor" ALTER COLUMN "mode" DROP DEFAULT;
ALTER TABLE "public"."Mentor" ALTER COLUMN "mode" TYPE "public"."MentorMode_new" USING ("mode"::text::"public"."MentorMode_new");
ALTER TYPE "public"."MentorMode" RENAME TO "MentorMode_old";
ALTER TYPE "public"."MentorMode_new" RENAME TO "MentorMode";
DROP TYPE "public"."MentorMode_old";
ALTER TABLE "public"."Mentor" ALTER COLUMN "mode" SET DEFAULT 'ONLINE';
COMMIT;
