import {PrismaClient} from "@prisma/client";
import {hashPassword} from "../utils/password";
import type {LogFilter} from "../types";

const prisma = new PrismaClient();

export class SuperAdminService {
  // User Management
  async getAllUsers() {
    return prisma.user.findMany({
      include: {
        participantTeam: {
          select: {id: true, name: true, teamId: true},
        },
        mentorProfile: {
          select: {id: true, expertise: true},
        },
        judgeProfile: {
          select: {id: true},
        },
      },
      orderBy: {createdAt: "desc"},
    });
  }

  async createUser(userData: {
    username: string
    password: string
    email?: string
    role: string
    expertise?: string[]
    floor?: string
  }) {
    const {username, password, email, role, expertise} = userData;

    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: {username},
    });

    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await hashPassword(password);

    // Create user with role-specific profile
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role: role as any,
        ...(role === "MENTOR" && {
          mentorProfile: {
            create: {
              expertise: expertise || [],
            },
          },
        }),
        ...(role === "JUDGE" && {
          judgeProfile: {
            create: {},
          },
        }),
      },
      include: {
        mentorProfile: true,
        judgeProfile: true,
      },
    });

    const {password: _, ...userWithoutPassword} = user;
    return userWithoutPassword;
  }

  async toggleUserStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: {id: userId},
    });

    if (!user) {
      throw new Error("User not found");
    }

    return prisma.user.update({
      where: {id: userId},
      data: {
        status: user.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
      },
    });
  }

  async deleteUser(userId: string) {
    // Check if user exists and get their role
    const user = await prisma.user.findUnique({
      where: {id: userId},
      include: {
        mentorProfile: true,
        judgeProfile: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete role-specific profiles first
    if (user.mentorProfile) {
      await prisma.mentor.delete({
        where: {userId},
      });
    }

    if (user.judgeProfile) {
      await prisma.judge.delete({
        where: {userId},
      });
    }

    // Delete the user
    return prisma.user.delete({
      where: {id: userId},
    });
  }

  // Problem Statement Management
  async getAllProblemStatements() {
    const psList = await prisma.problemStatement.findMany({
      include: {
        domain: true,
        teams: {
          select: {id: true, name: true, teamId: true},
        },
        _count: {
          select: {teams: true},
        },
      },
      orderBy: {createdAt: "desc"},
    });
    return psList.map((ps) => ({
      ...ps,
      selectedCount: ps._count.teams,
    }));
  }

  async createProblemStatement(data: {
    title: string
    description: string
    domainId: string
  }) {
    return prisma.problemStatement.create({
      data,
      include: {
        domain: true,
      },
    });
  }

  async updateProblemStatement(
    id: string,
    data: {
      title: string;
      description: string;
      domainId: string;
      deliverables: string[];
    },
  ) {
    return prisma.problemStatement.update({
      where: {id},
      data,
      include: {
        domain: true,
      },
    });
  }

  async deleteProblemStatement(id: string) {
    // Check if any teams have selected this PS
    const teamsCount = await prisma.team.count({
      where: {problemStatementId: id},
    });

    if (teamsCount > 0) {
      throw new Error("Cannot delete problem statement that has been selected by teams");
    }

    return prisma.problemStatement.delete({
      where: {id},
    });
  }

  async toggleProblemStatementLock(locked: boolean) {
    await prisma.systemSettings.upsert({
      where: {key: "problem_statements_locked"},
      update: {value: locked.toString()},
      create: {
        key: "problem_statements_locked",
        value: locked.toString(),
        description: "Whether problem statement selection is locked",
      },
    });

    return {locked};
  }

  // Team Management
  async getAllTeams() {
    return prisma.team.findMany({
      include: {
        participants: {
          select: {id: true, username: true, email: true},
        },
        problemStatement: {
          include: {domain: true},
        },
        evaluations: {
          include: {
            judge: {
              include: {
                user: {select: {username: true}},
              },
            },
          },
        },
        teamScores: {
          include: {
            judge: {
              include: {
                user: {select: {username: true}},
              },
            },
          },
        },
        submissions: true,
        round2Room: true,
      },
      orderBy: {createdAt: "desc"},
    });
  }

  async getTeamDetails(teamId: string) {
    const team = await prisma.team.findUnique({
      where: {id: teamId},
      include: {
        participants: {
          select: {id: true, username: true, email: true},
        },
        problemStatement: {
          include: {domain: true},
        },
        evaluations: {
          include: {
            judge: {
              include: {
                user: {select: {username: true}},
              },
            },
          },
        },
        teamScores: {
          include: {
            judge: {
              include: {
                user: {select: {username: true}},
              },
            },
          },
        },
        submissions: true,
        checkpoints: true,
        mentorshipQueue: {
          include: {
            mentor: {
              include: {
                user: {select: {username: true}},
              },
            },
          },
        },
        round2Room: true,
      },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    return team;
  }

  // System Settings
  async toggleMentorshipLock(locked: boolean) {
    await prisma.systemSettings.upsert({
      where: {key: "mentorship_locked"},
      update: {value: locked.toString()},
      create: {
        key: "mentorship_locked",
        value: locked.toString(),
        description: "Whether mentorship booking is locked",
      },
    });

    return {locked};
  }

  async toggleRound1Lock(locked: boolean) {
    await prisma.systemSettings.upsert({
      where: {key: "round1_locked"},
      update: {value: locked.toString()},
      create: {
        key: "round1_locked",
        value: locked.toString(),
        description: "Whether round 1 submissions are locked",
      },
    });

    return {locked};
  }

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

  // Activity Logs
  async getActivityLogs(filters?: LogFilter) {
    const where: any = {};

    if (filters?.action && filters.action !== "all") {
      where.action = {contains: filters.action, mode: "insensitive"};
    }

    if (filters?.userId && filters.userId !== "all") {
      where.userId = filters.userId;
    }

    return prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: {id: true, username: true, role: true},
        },
      },
      orderBy: {createdAt: "desc"},
      take: 1000, // Limit to prevent performance issues
    });
  }

  // Announcements
  async createAnnouncement(
    authorId: string,
    data: {
      title: string
      message: string
    },
  ) {
    return prisma.announcement.create({
      data: {
        ...data,
        authorId,
      },
      include: {
        author: {
          select: {username: true, role: true},
        },
      },
    });
  }

  async getAllAnnouncements() {
    return prisma.announcement.findMany({
      include: {
        author: {
          select: {username: true, role: true},
        },
      },
      orderBy: {createdAt: "desc"},
    });
  }

  // Team-Judge Mapping
  async getTeamJudgeMappings() {
    return prisma.evaluation.findMany({
      include: {
        team: {
          select: {id: true, name: true, teamId: true, problemStatement: {include: {domain: true}}},
        },
        judge: {
          include: {
            user: {select: {username: true}},
          },
        },
      },
    });
  }

  async mapTeamToJudge(teamId: string, judgeId: string) {
    // Check if mapping already exists
    const existingMapping = await prisma.evaluation.findUnique({
      where: {
        teamId_judgeId_round: {
          teamId,
          judgeId,
          round: 1,
        },
      },
    });

    if (existingMapping) {
      throw new Error("Team is already mapped to this judge");
    }

    return prisma.evaluation.create({
      data: {
        teamId,
        judgeId,
        round: 1,
      },
      include: {
        team: {select: {name: true, teamId: true}},
        judge: {
          include: {
            user: {select: {username: true}},
          },
        },
      },
    });
  }

  async removeTeamJudgeMapping(teamId: string, judgeId: string) {
    return prisma.evaluation.delete({
      where: {
        teamId_judgeId_round: {
          teamId,
          judgeId,
          round: 1,
        },
      },
    });
  }

  // Round 2 Management
  async promoteTeamsToRound2(teamIds: string[]) {
    return prisma.team.updateMany({
      where: {
        id: {in: teamIds},
      },
      data: {
        status: "ROUND1_QUALIFIED",
      },
    });
  }

  async getRound2Rooms() {
    return prisma.round2Room.findMany({
      include: {
        teams: {
          select: {id: true, name: true, teamId: true},
        },
      },
    });
  }

  async createRound2Room(data: {
    name: string
    capacity?: number
    floor?: string
  }) {
    return prisma.round2Room.create({
      data,
    });
  }

  async assignJudgeToRoom(judgeId: string, roomId: string) {
    return prisma.judge.update({
      where: {id: judgeId},
      data: {},
    });
  }

  async assignTeamToRoom(teamId: string, roomId: string) {
    return prisma.team.update({
      where: {id: teamId},
      data: {round2RoomId: roomId},
    });
  }

  async getAllJudges() {
    return prisma.judge.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true
          }
        },
        evaluations: true,
      }
    });
  }

  async getAllMentors() {
    return prisma.mentor.findMany({
      include: {
        user: {select: {id: true, username: true, role: true}},
        mentorshipQueue: {
          include: {
            team: {
              select: {
                name: true,
              },
            },
          },
        },
      }
    });
  }

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

  async createMentor(payload: { name: string; domain: string; mode: "ONLINE" | "OFFLINE" }) {
    // Generate a random password
    const rawPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await hashPassword(rawPassword);

    // Create user and mentor profile
    const user = await prisma.user.create({
      data: {
        username: payload.name.toLowerCase().replace(/\s+/g, "_"),
        password: hashedPassword,
        role: "MENTOR",
        mentorProfile: {
          create: {
            domain: payload.domain,
            mode: payload.mode,
          },
        },
      },
      include: {
        mentorProfile: true,
      },
    });

    const newMentor = await prisma.mentor.findUnique({
      where: {userId: user.id},
      include: {user: {select: {id: true, username: true, role: true}}},
    });

    return {newMentor, rawPassword};
  }

  async deleteMentor(mentorId: string) {
    // Check if mentor exists
    const mentor = await prisma.mentor.findUnique({
      where: {id: mentorId},
    });

    if (!mentor) {
      throw new Error("Mentor not found");
    }

    // Delete the user, which will cascade to delete the mentor profile
    return prisma.user.delete({
      where: {id: mentor.userId},
    });
  }

  async addJudge(payload: { name: string; }) {
    // Generate a random password
    const rawPassword = Math.random().toString(36).slice(-6);
    const hashedPassword = await hashPassword(rawPassword);

    // Create user and judge profile
    const user = await prisma.user.create({
      data: {
        username: payload.name
          .replace(/^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Prof\.?)\s+/i, "") // remove title at start
          .toLowerCase()
          .replace(/\s+/g, "_"),
        password: hashedPassword,
        role: "JUDGE",
        judgeProfile: {
          create: {},
        },
      }
    });

    const newJudge = await prisma.judge.findUnique({
      where: {userId: user.id},
      include: {user: {select: {id: true, username: true, role: true}}},
    });

    return {newJudge, rawPassword};
  }

  async deleteJudge(judgeId: string) {
    // Check if judge exists
    const judge = await prisma.judge.findUnique({
      where: {id: judgeId},
    });

    if (!judge) {
      throw new Error("Judge not found");
    }

    // Delete the user, which will cascade to delete the judge profile
    return prisma.user.delete({
      where: {id: judge.userId},
    });
  }

  async getTeamScores() {
    return prisma.team.findMany({
      include: {
        teamScores: {
          select: {
            id: true,
            totalScore: true,
            round: true,
            createdAt: true,
            judge: {
              include: {
                user: { select: { username: true } },
              },
            },
          },
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
      },
    });
  }
}

export const superAdminService = new SuperAdminService();
