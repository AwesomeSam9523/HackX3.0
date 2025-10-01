/*
  Warnings:

  - You are about to drop the `activity_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `announcements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `domains` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `evaluations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `judges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mentors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mentorship_queue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `problem_statements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ps_bookmarks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `round2_rooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `system_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_checkpoints` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_scores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."activity_logs" DROP CONSTRAINT "activity_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."announcements" DROP CONSTRAINT "announcements_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."evaluations" DROP CONSTRAINT "evaluations_judgeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."evaluations" DROP CONSTRAINT "evaluations_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."judges" DROP CONSTRAINT "judges_round2RoomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."judges" DROP CONSTRAINT "judges_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."mentors" DROP CONSTRAINT "mentors_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."mentorship_queue" DROP CONSTRAINT "mentorship_queue_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."mentorship_queue" DROP CONSTRAINT "mentorship_queue_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."problem_statements" DROP CONSTRAINT "problem_statements_domainId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ps_bookmarks" DROP CONSTRAINT "ps_bookmarks_problemStatementId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ps_bookmarks" DROP CONSTRAINT "ps_bookmarks_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."submissions" DROP CONSTRAINT "submissions_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."team_checkpoints" DROP CONSTRAINT "team_checkpoints_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."team_scores" DROP CONSTRAINT "team_scores_judgeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."team_scores" DROP CONSTRAINT "team_scores_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."teams" DROP CONSTRAINT "teams_problemStatementId_fkey";

-- DropForeignKey
ALTER TABLE "public"."teams" DROP CONSTRAINT "teams_round2RoomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_teamId_fkey";

-- DropTable
DROP TABLE "public"."activity_logs";

-- DropTable
DROP TABLE "public"."announcements";

-- DropTable
DROP TABLE "public"."domains";

-- DropTable
DROP TABLE "public"."evaluations";

-- DropTable
DROP TABLE "public"."judges";

-- DropTable
DROP TABLE "public"."mentors";

-- DropTable
DROP TABLE "public"."mentorship_queue";

-- DropTable
DROP TABLE "public"."problem_statements";

-- DropTable
DROP TABLE "public"."ps_bookmarks";

-- DropTable
DROP TABLE "public"."round2_rooms";

-- DropTable
DROP TABLE "public"."submissions";

-- DropTable
DROP TABLE "public"."system_settings";

-- DropTable
DROP TABLE "public"."team_checkpoints";

-- DropTable
DROP TABLE "public"."team_scores";

-- DropTable
DROP TABLE "public"."teams";

-- DropTable
DROP TABLE "public"."users";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "role" "public"."UserRole" NOT NULL,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roomNumber" TEXT,
    "status" "public"."TeamStatus" NOT NULL DEFAULT 'REGISTERED',
    "submissionStatus" "public"."SubmissionStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "githubRepo" TEXT,
    "presentationLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "problemStatementId" TEXT,
    "round2RoomId" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Domain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProblemStatement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PSBookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemStatementId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PSBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mentor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expertise" TEXT[],
    "meetLink" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "floor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Judge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "floor" TEXT,
    "expertise" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "round2RoomId" TEXT,

    CONSTRAINT "Judge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MentorshipQueue" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "status" "public"."QueueStatus" NOT NULL DEFAULT 'WAITING',
    "query" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorshipQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evaluation" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "judgeId" TEXT NOT NULL,
    "status" "public"."EvaluationStatus" NOT NULL DEFAULT 'PENDING',
    "round" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TeamScore" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "judgeId" TEXT NOT NULL,
    "innovation" DOUBLE PRECISION,
    "technical" DOUBLE PRECISION,
    "presentation" DOUBLE PRECISION,
    "impact" DOUBLE PRECISION,
    "feasibility" DOUBLE PRECISION,
    "totalScore" DOUBLE PRECISION,
    "feedback" TEXT,
    "round" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Submission" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "githubRepo" TEXT,
    "presentationLink" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Round2Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 10,
    "floor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Round2Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TeamCheckpoint" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "checkpoint" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "data" JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamCheckpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SystemSettings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Team_teamId_key" ON "public"."Team"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_name_key" ON "public"."Domain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PSBookmark_userId_problemStatementId_key" ON "public"."PSBookmark"("userId", "problemStatementId");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_userId_key" ON "public"."Mentor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Judge_userId_key" ON "public"."Judge"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_teamId_judgeId_round_key" ON "public"."Evaluation"("teamId", "judgeId", "round");

-- CreateIndex
CREATE UNIQUE INDEX "TeamScore_teamId_judgeId_round_key" ON "public"."TeamScore"("teamId", "judgeId", "round");

-- CreateIndex
CREATE UNIQUE INDEX "Round2Room_name_key" ON "public"."Round2Room"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamCheckpoint_teamId_checkpoint_key" ON "public"."TeamCheckpoint"("teamId", "checkpoint");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSettings_key_key" ON "public"."SystemSettings"("key");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_problemStatementId_fkey" FOREIGN KEY ("problemStatementId") REFERENCES "public"."ProblemStatement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_round2RoomId_fkey" FOREIGN KEY ("round2RoomId") REFERENCES "public"."Round2Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProblemStatement" ADD CONSTRAINT "ProblemStatement_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "public"."Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PSBookmark" ADD CONSTRAINT "PSBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PSBookmark" ADD CONSTRAINT "PSBookmark_problemStatementId_fkey" FOREIGN KEY ("problemStatementId") REFERENCES "public"."ProblemStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Mentor" ADD CONSTRAINT "Mentor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Judge" ADD CONSTRAINT "Judge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Judge" ADD CONSTRAINT "Judge_round2RoomId_fkey" FOREIGN KEY ("round2RoomId") REFERENCES "public"."Round2Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MentorshipQueue" ADD CONSTRAINT "MentorshipQueue_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MentorshipQueue" ADD CONSTRAINT "MentorshipQueue_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "public"."Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evaluation" ADD CONSTRAINT "Evaluation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evaluation" ADD CONSTRAINT "Evaluation_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "public"."Judge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamScore" ADD CONSTRAINT "TeamScore_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamScore" ADD CONSTRAINT "TeamScore_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "public"."Judge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Announcement" ADD CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamCheckpoint" ADD CONSTRAINT "TeamCheckpoint_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
