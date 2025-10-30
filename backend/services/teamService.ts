import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export class TeamService {
  // Get participant's team information
  async getTeamInfo(userId: string) {
    const user = await prisma.user.findUnique({
      where: {id: userId},
      include: {
        participantTeam: {
          include: {
            participants: {
              select: {id: true, name: true, email: true},
            },
            problemStatement: {
              include: {domain: true},
            },
            submissions: {
              orderBy: {submittedAt: "desc"},
              take: 1,
            },
            checkpoints: {
              orderBy: {checkpoint: "asc"},
            },
            mentorshipQueue: {
              include: {
                mentor: {
                  include: {
                    user: {select: {username: true}},
                  },
                },
              },
              orderBy: {createdAt: "desc"},
            },
            evaluations: {
              select: {
                status: true,
                judge: {
                  include: {
                    user: {select: {username: true}},
                  },
                },
              },
            },
            round1Room: {
              select: {id: true, block: true, name: true},
            },
            round2Room: {
              select: {id: true, block: true, name: true},
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
              select: {teams: true},
            },
          },
        },
      },
      orderBy: {name: "asc"},
    });
  }

  // Get all problem statements
  async getProblemStatements() {
    return prisma.problemStatement.findMany({
      include: {
        domain: true,
        _count: {
          select: {teams: true},
        },
      },
      orderBy: {createdAt: "desc"},
    });
  }

  // Select problem statement for team
  async selectProblemStatement(userId: string, problemStatementId: string) {
    const user = await prisma.user.findUnique({
      where: {id: userId},
      include: {participantTeam: true},
    });

    if (!user || !user.participantTeam) {
      throw new Error("Team not found for this participant");
    }

    // Check if problem statements are locked
    const psLockSetting = await prisma.systemSettings.findUnique({
      where: {key: "problem_statements_locked"},
    });

    if (psLockSetting && psLockSetting.value === "true") {
      throw new Error("Problem statement selection is currently locked");
    }

    // Update team with selected problem statement
    return prisma.team.update({
      where: {id: user.participantTeam.id},
      data: {
        problemStatementId,
        status: "PROBLEM_SELECTED",
      },
      include: {
        problemStatement: {
          include: {domain: true},
        },
      },
    });
  }

  async getSelectedProblemStatement(userId: string) {
    const user = await prisma.user.findUnique({
      where: {id: userId},
      include: {participantTeam: true},
    });
    if (!user || !user.teamId) {
      throw new Error("Team not found for this participant");
    }

    const team = await prisma.team.findUnique({
      where: {id: user.teamId},
      include: {
        problemStatement: {
          include: {domain: true},
        }
      }
    });
    if (!team) {
      throw new Error("Team not found for this participant");
    }

    return team.problemStatement;
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
        where: {id: existingBookmark.id},
      });
      return {bookmarked: false};
    } else {
      // Add bookmark
      await prisma.pSBookmark.create({
        data: {
          userId,
          problemStatementId,
        },
      });
      return {bookmarked: true};
    }
  }

  // Get bookmarked problem statements
  async getBookmarkedProblemStatements(userId: string) {
    const bookmarks = await prisma.pSBookmark.findMany({
      where: {userId},
      include: {
        problemStatement: {
          include: {
            domain: true,
            _count: {
              select: {teams: true},
            },
          },
        },
      },
    });

    return bookmarks.map((bookmark) => bookmark.problemStatement);
  }

  // Submit project
  async submitProject(userId: string, data: { githubLink: string; pptLink: string }) {
    if (!data.githubLink && !data.pptLink) {
      throw new Error("Submission link (GitHub and PPT) is required");
    }

    const user = await prisma.user.findUnique({
      where: {id: userId},
      include: {participantTeam: true},
    });

    if (!user || !user.participantTeam) {
      throw new Error("Team not found for this participant");
    }

    // Check if round 1 is locked
    const round1LockSetting = await prisma.systemSettings.findUnique({
      where: {key: "round1_locked"},
    });

    if (round1LockSetting && round1LockSetting.value === "true") {
      throw new Error("Round 1 submissions are currently locked");
    }

    // check if githubLink is a valid URL
    if (data.githubLink) {
      try {
        new URL(data.githubLink);
      } catch (_) {
        throw new Error("Invalid GitHub URL");
      }
    }
    if (!data.githubLink.startsWith('https://github.com/')) {
      throw new Error("GitHub link is invalid");
    }
    // check if pptLink is a valid URL
    if (data.pptLink) {
      try {
        new URL(data.pptLink);
      } catch (_) {
        throw new Error("Invalid PPT URL");
      }
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
      where: {id: user.participantTeam.id},
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
      where: {id: userId},
      include: {participantTeam: true},
    });

    if (!user || !user.participantTeam) {
      throw new Error("Team not found for this participant");
    }

    return prisma.submission.findMany({
      where: {teamId: user.participantTeam.id},
      orderBy: {submittedAt: "desc"},
    });
  }

  // Book mentorship session
  async bookMentorshipSession(userId: string, data: { mentorId: string; query: string }) {
    const user = await prisma.user.findUnique({
      where: {id: userId},
      include: {participantTeam: true},
    });

    if (!user || !user.participantTeam) {
      throw new Error("Team not found for this participant");
    }

    // Check if mentorship is locked
    const mentorshipLockSetting = await prisma.systemSettings.findUnique({
      where: {key: "mentorship_locked"},
    });

    if (mentorshipLockSetting && mentorshipLockSetting.value === "true") {
      throw new Error("Mentorship booking is currently locked");
    }

    // Check if mentor exists and is available
    const mentor = await prisma.mentor.findUnique({
      where: {id: data.mentorId},
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
        status: "WAITING",
      },
    });

    if (existingSession) {
      throw new Error("Team already has a pending session with this mentor");
    }

    // check if mentor already has 5 sessions
    const activeSessionsCount = await prisma.mentorshipQueue.count({
      where: {
        mentorId: data.mentorId,
        status: "WAITING",
      },
    });
    if (activeSessionsCount >= 5) {
      return new Error("Mentorship queue full! Try again later.");
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
              select: {username: true},
            },
          },
        },
      },
    });
  }

  // Get available mentors
  async getAvailableMentors() {
    const mentors = await prisma.mentor.findMany({
      where: {isAvailable: true},
      include: {
        user: {
          select: {id: true, username: true},
        },
        mentorshipQueue: {
          include: {
            team: {select: {id: true, name: true}},
          },
          orderBy: {createdAt: "desc"},
        },
      },
      orderBy: {createdAt: "desc"},
    });

    return mentors.map((mentor) => {
      const latestPerTeam = new Map<string, typeof mentor.mentorshipQueue[0]>();
      for (const entry of mentor.mentorshipQueue) {
        if (!latestPerTeam.has(entry.teamId)) {
          latestPerTeam.set(entry.teamId, entry);
        }
      }

      const waitingTeamsCount = Array.from(latestPerTeam.values()).filter(
        (entry) => entry.status === "WAITING"
      ).length;

      const {mentorshipQueue, ...rest} = mentor;
      return {
        ...rest,
        waitingTeamsCount,
      };
    });
  }

  // Get selected mentor
  async getSelectedMentor(userId: string) {
    const user = await prisma.user.findUnique({
      where: {id: userId},
      include: {participantTeam: true},
    });

    if (!user || !user.participantTeam || !user.teamId) {
      throw new Error("Team not found for this participant");
    }

    const team = await prisma.team.findUnique({
      where: {id: user.teamId},
    });

    if (!team) {
      throw new Error("Team not found");
    }

    const session = await prisma.mentorshipQueue.findFirst({
      where: {
        teamId: user.teamId,
      },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              }
            },
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    if (!session || session.status !== "WAITING") {
      return null;
    }

    const mentor = await prisma.mentor.findUnique({
      where: {id: session.mentorId},
      include: {
        user: {
          select: {id: true, username: true},
        },
        mentorshipQueue: {
          include: {
            team: {select: {id: true, name: true}},
          },
          orderBy: {createdAt: "desc"},
        },
      },
    });

    if (!mentor) {
      throw new Error("Mentor not found");
    }

    const latestPerTeam = new Map<string, typeof mentor.mentorshipQueue[0]>();
    for (const entry of mentor.mentorshipQueue) {
      if (!latestPerTeam.has(entry.teamId)) {
        latestPerTeam.set(entry.teamId, entry);
      }
    }

    const waitingTeamsCount = Array.from(latestPerTeam.values()).filter(
      (entry) => entry.status === "WAITING"
    ).length;

    const {notes, ...rest} = session;
    // @ts-ignore
    rest.mentor['waitingTeamsCount'] = waitingTeamsCount;
    return rest;
  }

  // Get announcements
  async getAnnouncements() {
    return prisma.announcement.findMany({
      include: {
        author: {
          select: {username: true, role: true},
        },
      },
      orderBy: {createdAt: "desc"},
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
      where: {id: userId},
      include: {participantTeam: true},
    });

    if (!user || !user.participantTeam) {
      throw new Error("Team not found for this participant");
    }

    // Check if the queue item belongs to this team
    const queueItem = await prisma.mentorshipQueue.findUnique({
      where: {id: queueItemId},
    });

    if (!queueItem || queueItem.teamId !== user.participantTeam.id) {
      throw new Error("Mentorship session not found or not assigned to this team");
    }

    if (queueItem.status !== "WAITING") {
      throw new Error("Can only cancel waiting mentorship sessions");
    }

    return prisma.mentorshipQueue.update({
      where: {id: queueItemId},
      data: {status: "CANCELLED"},
    });
  }

  async getLockedOverview() {
    const overview = await prisma.systemSettings.findMany();
    return overview.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }

  // Get team participants
  async getTeamParticipants(teamId: string) {
    return prisma.teamParticipant.findMany({
      where: {teamId},
      orderBy: {createdAt: "asc"},
    });
  }

  // Add team participant
  async addTeamParticipant(teamId: string, data: {
    name: string;
    email: string;
    phone?: string;
    role?: "MEMBER" | "LEADER";
  }) {
    return prisma.teamParticipant.create({
      data: {
        teamId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || "MEMBER",
        verified: false,
      },
    });
  }

  // Update team participant
  async updateTeamParticipant(participantId: string, data: {
    name?: string;
    email?: string;
    phone?: string;
    role?: "MEMBER" | "LEADER";
    verified?: boolean;
  }) {
    return prisma.teamParticipant.update({
      where: {id: participantId},
      data,
    });
  }

  // Delete team participant
  async deleteTeamParticipant(participantId: string) {
    return prisma.teamParticipant.delete({
      where: {id: participantId},
    });
  }

  // Toggle participant presence (using verified field)
  async toggleParticipantPresence(participantId: string, isPresent: boolean) {
    return prisma.teamParticipant.update({
      where: {id: participantId},
      data: {verified: isPresent},
    });
  }

  // Check if team has minimum participants present for checkpoint completion
  async checkMinimumParticipantsPresent(teamId: string): Promise<boolean> {
    const presentCount = await prisma.teamParticipant.count({
      where: {
        teamId,
        verified: true,
      },
    });
    
    return presentCount >= 2; // Minimum 2 participants must be present
  }

  // Complete checkpoint with participant validation
  async completeCheckpoint(teamId: string, checkpoint: number, data?: any) {
    // Check if minimum participants are present
    const hasMinimumPresent = await this.checkMinimumParticipantsPresent(teamId);
    
    if (!hasMinimumPresent) {
      throw new Error("Minimum 2 participants must be present to complete checkpoint");
    }

    // Get current participants data
    const participants = await this.getTeamParticipants(teamId);
    
    return prisma.teamCheckpoint.upsert({
      where: {
        teamId_checkpoint: {
          teamId,
          checkpoint,
        },
      },
      update: {
        status: "COMPLETED",
        data: {
          ...data,
          participants: participants.map(p => ({
            id: p.id,
            name: p.name,
            email: p.email,
            phone: p.phone,
            role: p.role,
            isPresent: p.verified,
          })),
          completedAt: new Date().toISOString(),
        },
        completedAt: new Date(),
      },
      create: {
        teamId,
        checkpoint,
        status: "COMPLETED",
        data: {
          ...data,
          participants: participants.map(p => ({
            id: p.id,
            name: p.name,
            email: p.email,
            phone: p.phone,
            role: p.role,
            isPresent: p.verified,
          })),
          completedAt: new Date().toISOString(),
        },
        completedAt: new Date(),
      },
    });
  }

  async getTeamPreviousMentorshipStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: {id: userId},
      include: {participantTeam: true},
    });

    if (!user || !user.participantTeam || !user.teamId) {
      throw new Error("Team not found for this participant");
    }

    const team = await prisma.team.findUnique({
      where: {id: user.teamId},
    });

    if (!team) {
      throw new Error("Team not found");
    }

    // Check if the team has completed at least one mentorship session
    const completedSessionsCount = await prisma.mentorshipQueue.count({
      where: {
        teamId: user.teamId,
        status: "RESOLVED",
      },
    });
    return completedSessionsCount === 0;
  }
}

export const teamService = new TeamService();