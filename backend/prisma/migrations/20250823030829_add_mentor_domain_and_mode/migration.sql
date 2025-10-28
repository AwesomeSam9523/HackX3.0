-- CreateEnum
CREATE TYPE "public"."MentorMode" AS ENUM ('ONLINE', 'IN_PERSON');

-- AlterTable
ALTER TABLE "public"."Mentor" ADD COLUMN     "domain" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "mode" "public"."MentorMode" NOT NULL DEFAULT 'ONLINE';
