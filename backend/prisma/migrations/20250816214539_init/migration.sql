-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PARTICIPANT', 'MENTOR', 'JUDGE', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('REGISTERED', 'PROBLEM_SELECTED', 'ROUND1_SUBMITTED', 'ROUND2_QUALIFIED', 'ROUND2_SUBMITTED', 'ELIMINATED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NOT_SUBMITTED', 'PARTIAL', 'SUBMITTED');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('WAITING', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roomNumber" TEXT,
    "status" "TeamStatus" NOT NULL DEFAULT 'REGISTERED',
    "submissionStatus" "SubmissionStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "githubRepo" TEXT,
    "presentationLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "problemStatementId" TEXT,
    "round2RoomId" TEXT,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domains" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_statements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problem_statements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ps_bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemStatementId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ps_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentors" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expertise" TEXT[],
    "meetLink" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "floor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "judges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "floor" TEXT,
    "expertise" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "round2RoomId" TEXT,

    CONSTRAINT "judges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentorship_queue" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT 'WAITING',
    "query" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentorship_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "judgeId" TEXT NOT NULL,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'PENDING',
    "round" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_scores" (
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

    CONSTRAINT "team_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "githubRepo" TEXT,
    "presentationLink" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "round2_rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 10,
    "floor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "round2_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_checkpoints" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "checkpoint" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "data" JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_checkpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "teams_teamId_key" ON "teams"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "domains_name_key" ON "domains"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ps_bookmarks_userId_problemStatementId_key" ON "ps_bookmarks"("userId", "problemStatementId");

-- CreateIndex
CREATE UNIQUE INDEX "mentors_userId_key" ON "mentors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "judges_userId_key" ON "judges"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_teamId_judgeId_round_key" ON "evaluations"("teamId", "judgeId", "round");

-- CreateIndex
CREATE UNIQUE INDEX "team_scores_teamId_judgeId_round_key" ON "team_scores"("teamId", "judgeId", "round");

-- CreateIndex
CREATE UNIQUE INDEX "round2_rooms_name_key" ON "round2_rooms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "team_checkpoints_teamId_checkpoint_key" ON "team_checkpoints"("teamId", "checkpoint");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_problemStatementId_fkey" FOREIGN KEY ("problemStatementId") REFERENCES "problem_statements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_round2RoomId_fkey" FOREIGN KEY ("round2RoomId") REFERENCES "round2_rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_statements" ADD CONSTRAINT "problem_statements_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "domains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ps_bookmarks" ADD CONSTRAINT "ps_bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ps_bookmarks" ADD CONSTRAINT "ps_bookmarks_problemStatementId_fkey" FOREIGN KEY ("problemStatementId") REFERENCES "problem_statements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentors" ADD CONSTRAINT "mentors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judges" ADD CONSTRAINT "judges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judges" ADD CONSTRAINT "judges_round2RoomId_fkey" FOREIGN KEY ("round2RoomId") REFERENCES "round2_rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_queue" ADD CONSTRAINT "mentorship_queue_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_queue" ADD CONSTRAINT "mentorship_queue_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "judges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_scores" ADD CONSTRAINT "team_scores_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_scores" ADD CONSTRAINT "team_scores_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "judges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_checkpoints" ADD CONSTRAINT "team_checkpoints_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
