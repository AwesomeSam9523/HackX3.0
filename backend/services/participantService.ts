import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ParticipantService {
  // Get participant's team information
  async getTeamInfo(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        participantTeam: {
          include: {
            participants: {
              select: { id: true, username: true, email: true },
            },
            problemStatement: {
              include: { domain: true },
            },
            submissions: {
              orderBy: { submittedAt: "desc" },
              take: 1,
            },
            checkpoints: {
              orderBy: { checkpoint: "asc" },
            },
            mentorshipQueue: {
              include: {
                mentor: {
                  include: {
                    user: { select: { username: true } },
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            },
            evaluations: {
              select: {
                status: true,
                judge: {
                  include: {
                    user: { select: { username: true } },
                  },
                },
              },
            },
            round2Room: {
              select: { id: true, name: true, floor: true },
            },
          },
        },
      },
    });

    if (!user || !user.participantTeam) {
      throw new Error("Team not found for this participant");
    }

    return user.participantTeam;
  }

  // Get all domains with problem statements
  async getDomains() {
    return prisma.domain.findMany({
      include: {
        problemStatements: {
          include: {
            _count: {
              select: { teams: true },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  // Get all problem statements
  async getProblemStatements() {
    return prisma.problemStatement.findMany({
      include: {
        domain: true,
        _count: {
          select: { teams: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Select problem statement for team
  async selectProblemStatement(userId: string, problemStatementId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { participantTeam: true },
    });

    if (!user || !user.participantTeam) {
      throw new Error("Team not found for this participant");
    }

    // Check if problem statements are locked
    const psLockSetting = await prisma.systemSettings.findUnique({
      where: { key: "problem_statements_locked" },
    });

    if (psLockSetting && psLockSetting.value === "true") {
      throw new Error("Problem statement selection is currently locked");
    }

    // Check if team already has a problem statement
    if (user.participantTeam.problemStatementId) {
      throw new Error("Team has already selected a problem statement");
    }

    // Update team with selected problem statement
    const updatedTeam = await prisma.team.update({
      where: { id: user.participantTeam.id },
      data: {
        problemStatementId,
        status: "PROBLEM_SELECTED",
      },
      include: {
        problemStatement: {
          include: { domain: true },
        },
      },
    });

    return updatedTeam;
  }

  // Bookmark problem statement
  async bookmarkProblemStatement(userId: string, problemStatementId: string) {
    // Check if bookmark already exists
    const existingBookmark = await prisma.pSBookmark.findUnique({
      where: {
        userId_problemStatementId: {
          userId,
          problemStatementId,
        },
      },
    });

    if (existingBookmark) {
      // Remove bookmark
      await prisma.pSBookmark.delete({
        where: { id: existingBookmark.id },
      });
      return { bookmarked: false };
    } else {
      // Add bookmark
      await prisma.pSBookmark.create({
        data: {
          userId,
          problemStatementId,
        },
      });
      return { bookmarked: true };
    }
  }

  // Get bookmarked problem statements
  async getBookmarkedProblemStatements(userId: string) {
    const bookmarks = await prisma.pSBookmark.findMany({
      where: { userId },
      include: {
        problemStatement: {
          include: {
            domain: true,
            _count: {
              select: { teams: true },
            },
          },
        },
      },
    });

    return bookmarks.map((bookmark) => bookmark.problemStatement);
  }

  // Submit project
  async submitProject(userId: string, data: { githubLink?: string; pptLink?: string }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { participantTeam: true },
    });

    if (!user || !user.participantTeam) {
      throw new Error("Team not found for this participant");
    }

    // Check if round 1 is locked
    const round1LockSetting = await prisma.systemSettings.findUnique({
      where: { key: "round1_locked" },
    });

    if (round1LockSetting && round1LockSetting.value === "true") {
      throw new Error("Round 1 submissions are currently locked");
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        teamId: user.participantTeam.id,
        githubRepo: data.githubLink,
        presentationLink: data.pptLink,
      },
    });

    // Update team submission status and links
    const submissionStatus = data.githubLink && data.pptLink ? "SUBMITTED" : "PARTIAL";

    await prisma.team.update({
      where: { id: user.participantTeam.id },
      data: {
        submissionStatus,
        githubRepo: data.githubLink,
        presentationLink: data.pptLink,
        status: submissionStatus === "SUBMITTED" ? "ROUND1_SUBMITTED" : user.participantTeam.status,
      },
    });

    return submission;
  }

  // Get team submissions
  async getTeamSubmissions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { participantTeam: true },
    });

    if (!user || !user.participantTeam) {
      throw new Error("Team not found for this participant");
    }

    return prisma.submission.findMany({
      where: { teamId: user.participantTeam.id },
      orderBy: { submittedAt: "desc" },
    });
  }

  // Book mentorship session
  async bookMentorshipSession(userId: string, data: { mentorId: string; query?: string }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { participantTeam: true },
    });

    if (!user || !user.participantTeam) {
      throw new Error("Team not found for this participant");
    }

    // Check if mentorship is locked
    const mentorshipLockSetting = await prisma.systemSettings.findUnique({
      where: { key: "mentorship_locked" },
    });

    if (mentorshipLockSetting && mentorshipLockSetting.value === "true") {
      throw new Error("Mentorship booking is currently locked");
    }

    // Check if mentor exists and is available
    const mentor = await prisma.mentor.findUnique({
      where: { id: data.mentorId },
    });

    if (!mentor) {
      throw new Error("Mentor not found");
    }

    if (!mentor.isAvailable) {
      throw new Error("Mentor is not available");
    }

    // Check if team already has a pending session with this mentor
    const existingSession = await prisma.mentorshipQueue.findFirst({
      where: {
        teamId: user.participantTeam.id,
        mentorId: data.mentorId,
        status: { in: ["WAITING", "IN_PROGRESS"] },
      },
    });

    if (existingSession) {
      throw new Error("Team already has a pending session with this mentor");
    }

    // Create mentorship queue item
    return prisma.mentorshipQueue.create({
      data: {
        teamId: user.participantTeam.id,
        mentorId: data.mentorId,
        query: data.query,
        status: "WAITING",
      },
      include: {
        mentor: {
          include: {
            user: {
              select: { username: true },
            },
          },
        },
      },
    });
  }

  // Get available mentors
  async getAvailableMentors() {
    return prisma.mentor.findMany({
      where: { isAvailable: true },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        _count: {
          select: {
            mentorshipQueue: {
              where: { status: { in: ["WAITING", "IN_PROGRESS"] } },
            },
          },
        },
      },
      orderBy: [{ _count: { mentorshipQueue: "asc" } }, { createdAt: "desc" }],
    });
  }

  // Update team checkpoint
  async updateTeamCheckpoint(userId: string, checkpoint: number, data: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { participantTeam: true },
    });

    if (!user || !user.participantTeam) {
      throw new Error("Team not found for this participant");
    }

    return prisma.teamCheckpoint.upsert({
      where: {
        teamId_checkpoint: {
          teamId: user.participantTeam.id,
          checkpoint,
        },
      },
      update: {
        data,
        status: "completed",
        completedAt: new Date(),
      },
      create: {
        teamId: user.participantTeam.id,
        checkpoint,
        data,
        status: "completed",
        completedAt: new Date(),
      },
    });
  }

  // Get team checkpoints
  async getTeamCheckpoints(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { participantTeam: true },
    });

    if (!user || !user.participantTeam) {
      throw new Error("Team not found for this participant");
    }

    return prisma.teamCheckpoint.findMany({
      where: { teamId: user.participantTeam.id },
      orderBy: { checkpoint: "asc" },
    });
  }

  // Get announcements
  async getAnnouncements() {
    return prisma.announcement.findMany({
      include: {
        author: {
          select: { username: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  // Get system settings (read-only)
  async getSystemSettings() {
    const settings = await prisma.systemSettings.findMany();
    return settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }

  // Cancel mentorship session
  async cancelMentorshipSession(userId: string, queueItemId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { participantTeam: true },
    });

    if (!user || !user.participantTeam) {
      throw new Error("Team not found for this participant");
    }

    // Check if the queue item belongs to this team
    const queueItem = await prisma.mentorshipQueue.findUnique({
      where: { id: queueItemId },
    });

    if (!queueItem || queueItem.teamId !== user.participantTeam.id) {
      throw new Error("Mentorship session not found or not assigned to this team");
    }

    if (queueItem.status !== "WAITING") {
      throw new Error("Can only cancel waiting mentorship sessions");
    }

    return prisma.mentorshipQueue.update({
      where: { id: queueItemId },
      data: { status: "CANCELLED" },
    });
  }
}

export const participantService = new ParticipantService();
