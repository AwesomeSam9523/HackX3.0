/*
  Warnings:

  - You are about to drop the column `floor` on the `Round2Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Judge" ADD COLUMN     "round1RoomId" TEXT;

-- AlterTable
ALTER TABLE "public"."Round2Room" DROP COLUMN "floor";

-- AlterTable
ALTER TABLE "public"."Team" ADD COLUMN     "round1RoomId" TEXT;

-- CreateTable
CREATE TABLE "public"."Round1Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Round1Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Round1Room_name_key" ON "public"."Round1Room"("name");

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_round1RoomId_fkey" FOREIGN KEY ("round1RoomId") REFERENCES "public"."Round1Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Judge" ADD CONSTRAINT "Judge_round1RoomId_fkey" FOREIGN KEY ("round1RoomId") REFERENCES "public"."Round1Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
