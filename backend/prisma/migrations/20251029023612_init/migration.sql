-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('MEMBER', 'LEADER');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TEAM', 'MENTOR', 'JUDGE', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "MentorMode" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('REGISTERED', 'PROBLEM_SELECTED', 'ROUND1_SUBMITTED', 'ROUND1_QUALIFIED', 'ROUND2_SUBMITTED', 'ELIMINATED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NOT_SUBMITTED', 'PARTIAL', 'SUBMITTED');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('WAITING', 'RESOLVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CheckpointStatus" AS ENUM ('COMPLETED', 'PARTIALLY_COMPLETED');

-- CreateTable
CREATE TABLE "User"
(
    "id"        TEXT         NOT NULL,
    "username"  TEXT         NOT NULL,
    "password"  TEXT         NOT NULL,
    "email"     TEXT,
    "role"      "UserRole"   NOT NULL,
    "status"    "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId"    TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team"
(
    "id"                 TEXT               NOT NULL,
    "name"               TEXT               NOT NULL,
    "teamId"             TEXT               NOT NULL,
    "password"           TEXT,
    "status"             "TeamStatus"       NOT NULL DEFAULT 'REGISTERED',
    "submissionStatus"   "SubmissionStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "githubRepo"         TEXT,
    "presentationLink"   TEXT,
    "createdAt"          TIMESTAMP(3)       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3)       NOT NULL,
    "problemStatementId" TEXT,
    "round1RoomId"       TEXT,
    "round2RoomId"       TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamParticipant"
(
    "id"        TEXT              NOT NULL,
    "teamId"    TEXT              NOT NULL,
    "role"      "ParticipantRole" NOT NULL DEFAULT 'MEMBER',
    "name"      TEXT              NOT NULL,
    "email"     TEXT              NOT NULL,
    "phone"     TEXT,
    "verified"  BOOLEAN           NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)      NOT NULL,

    CONSTRAINT "TeamParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain"
(
    "id"          TEXT         NOT NULL,
    "name"        TEXT         NOT NULL,
    "description" TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemStatement"
(
    "id"           TEXT         NOT NULL,
    "title"        TEXT         NOT NULL,
    "description"  TEXT         NOT NULL,
    "domainId"     TEXT         NOT NULL,
    "deliverables" TEXT[],
    "isLocked"     BOOLEAN      NOT NULL DEFAULT false,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PSBookmark"
(
    "id"                 TEXT         NOT NULL,
    "userId"             TEXT         NOT NULL,
    "problemStatementId" TEXT         NOT NULL,
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PSBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentor"
(
    "id"          TEXT         NOT NULL,
    "name"        TEXT         NOT NULL,
    "userId"      TEXT         NOT NULL,
    "expertise"   TEXT[],
    "meetLink"    TEXT,
    "domain"      TEXT         NOT NULL DEFAULT 'General',
    "mode"        "MentorMode" NOT NULL DEFAULT 'ONLINE',
    "isAvailable" BOOLEAN      NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Judge"
(
    "id"        TEXT         NOT NULL,
    "userId"    TEXT         NOT NULL,
    "name"      TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Judge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorshipQueue"
(
    "id"        TEXT          NOT NULL,
    "teamId"    TEXT          NOT NULL,
    "mentorId"  TEXT          NOT NULL,
    "status"    "QueueStatus" NOT NULL DEFAULT 'WAITING',
    "query"     TEXT,
    "notes"     TEXT,
    "createdAt" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)  NOT NULL,

    CONSTRAINT "MentorshipQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation"
(
    "id"        TEXT               NOT NULL,
    "teamId"    TEXT               NOT NULL,
    "judgeId"   TEXT               NOT NULL,
    "status"    "EvaluationStatus" NOT NULL DEFAULT 'PENDING',
    "round"     INTEGER            NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3)       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)       NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamScore"
(
    "id"           TEXT         NOT NULL,
    "teamId"       TEXT         NOT NULL,
    "judgeId"      TEXT         NOT NULL,
    "innovation"   DOUBLE PRECISION,
    "technical"    DOUBLE PRECISION,
    "presentation" DOUBLE PRECISION,
    "impact"       DOUBLE PRECISION,
    "feasibility"  DOUBLE PRECISION,
    "totalScore"   DOUBLE PRECISION,
    "feedback"     TEXT,
    "round"        INTEGER      NOT NULL DEFAULT 1,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission"
(
    "id"               TEXT         NOT NULL,
    "teamId"           TEXT         NOT NULL,
    "githubRepo"       TEXT,
    "presentationLink" TEXT,
    "submittedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement"
(
    "id"        TEXT         NOT NULL,
    "title"     TEXT         NOT NULL,
    "message"   TEXT         NOT NULL,
    "authorId"  TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog"
(
    "id"        TEXT         NOT NULL,
    "userId"    TEXT,
    "action"    TEXT         NOT NULL,
    "details"   TEXT,
    "payload"   JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round1Room"
(
    "id"        TEXT         NOT NULL,
    "name"      TEXT         NOT NULL,
    "block"     TEXT         NOT NULL DEFAULT 'AB1',
    "capacity"  INTEGER      NOT NULL DEFAULT 6,
    "filled"    INTEGER      NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Round1Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round2Room"
(
    "id"        TEXT         NOT NULL,
    "name"      TEXT         NOT NULL,
    "block"     TEXT         NOT NULL DEFAULT 'AB1',
    "capacity"  INTEGER      NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Round2Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamCheckpoint"
(
    "id"          TEXT               NOT NULL,
    "teamId"      TEXT               NOT NULL,
    "checkpoint"  INTEGER            NOT NULL,
    "status"      "CheckpointStatus" NOT NULL,
    "data"        JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3)       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamCheckpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSettings"
(
    "id"          TEXT         NOT NULL,
    "key"         TEXT         NOT NULL,
    "value"       TEXT         NOT NULL,
    "description" TEXT,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User" ("username");

-- CreateIndex
CREATE UNIQUE INDEX "Team_teamId_key" ON "Team" ("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_name_key" ON "Domain" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "PSBookmark_userId_problemStatementId_key" ON "PSBookmark" ("userId", "problemStatementId");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_userId_key" ON "Mentor" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Judge_userId_key" ON "Judge" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_teamId_judgeId_round_key" ON "Evaluation" ("teamId", "judgeId", "round");

-- CreateIndex
CREATE UNIQUE INDEX "TeamScore_teamId_judgeId_round_key" ON "TeamScore" ("teamId", "judgeId", "round");

-- CreateIndex
CREATE UNIQUE INDEX "Round1Room_name_key" ON "Round1Room" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "Round2Room_name_key" ON "Round2Room" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamCheckpoint_teamId_checkpoint_key" ON "TeamCheckpoint" ("teamId", "checkpoint");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSettings_key_key" ON "SystemSettings" ("key");

-- AddForeignKey
ALTER TABLE "User"
    ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team"
    ADD CONSTRAINT "Team_problemStatementId_fkey" FOREIGN KEY ("problemStatementId") REFERENCES "ProblemStatement" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team"
    ADD CONSTRAINT "Team_round1RoomId_fkey" FOREIGN KEY ("round1RoomId") REFERENCES "Round1Room" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team"
    ADD CONSTRAINT "Team_round2RoomId_fkey" FOREIGN KEY ("round2RoomId") REFERENCES "Round2Room" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamParticipant"
    ADD CONSTRAINT "TeamParticipant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemStatement"
    ADD CONSTRAINT "ProblemStatement_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PSBookmark"
    ADD CONSTRAINT "PSBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PSBookmark"
    ADD CONSTRAINT "PSBookmark_problemStatementId_fkey" FOREIGN KEY ("problemStatementId") REFERENCES "ProblemStatement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentor"
    ADD CONSTRAINT "Mentor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Judge"
    ADD CONSTRAINT "Judge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipQueue"
    ADD CONSTRAINT "MentorshipQueue_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipQueue"
    ADD CONSTRAINT "MentorshipQueue_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation"
    ADD CONSTRAINT "Evaluation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation"
    ADD CONSTRAINT "Evaluation_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "Judge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamScore"
    ADD CONSTRAINT "TeamScore_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamScore"
    ADD CONSTRAINT "TeamScore_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "Judge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission"
    ADD CONSTRAINT "Submission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement"
    ADD CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog"
    ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamCheckpoint"
    ADD CONSTRAINT "TeamCheckpoint_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
