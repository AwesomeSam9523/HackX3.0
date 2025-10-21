-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('MEMBER', 'TEAM_LEADER');

-- CreateTable
CREATE TABLE "TeamParticipant" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "role" "ParticipantRole" NOT NULL DEFAULT 'MEMBER',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "isPresent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamParticipant_participantId_key" ON "TeamParticipant"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamParticipant_teamId_participantId_key" ON "TeamParticipant"("teamId", "participantId");

-- AddForeignKey
ALTER TABLE "TeamParticipant" ADD CONSTRAINT "TeamParticipant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
