/*
  Warnings:

  - You are about to drop the column `expertise` on the `Judge` table. All the data in the column will be lost.
  - You are about to drop the column `round1RoomId` on the `Judge` table. All the data in the column will be lost.
  - You are about to drop the column `round2RoomId` on the `Judge` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Judge" DROP CONSTRAINT "Judge_round1RoomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Judge" DROP CONSTRAINT "Judge_round2RoomId_fkey";

-- AlterTable
ALTER TABLE "public"."Judge" DROP COLUMN "expertise",
DROP COLUMN "round1RoomId",
DROP COLUMN "round2RoomId";
