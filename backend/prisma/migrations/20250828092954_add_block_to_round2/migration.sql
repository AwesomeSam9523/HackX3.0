-- AlterTable
ALTER TABLE "public"."Round1Room" ALTER COLUMN "block" SET DEFAULT 'AB1';

-- AlterTable
ALTER TABLE "public"."Round2Room" ADD COLUMN     "block" TEXT NOT NULL DEFAULT 'AB1';
