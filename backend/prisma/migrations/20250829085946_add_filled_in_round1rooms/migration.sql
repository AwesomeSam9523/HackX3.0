-- AlterTable
ALTER TABLE "public"."Round1Room" ADD COLUMN     "filled" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "capacity" SET DEFAULT 6;
