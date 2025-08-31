import { PrismaClient } from "@prisma/client";
import type { LogFilter } from "../types";
import {hashPassword} from "../utils/password";

const prisma = new PrismaClient();

interface Checkpoint1Data {
  teamId: string;
  wifi: boolean;
}

interface Checkpoint2Data {
  teamId: string;
}

export class AdminService {
  // Dashboard Overview
  async getDashboardOverview() {
    const [
      totalTeams,
      totalParticipants,
      totalMentors,
      totalJudges,
      teamsWithPS,
      teamsSubmitted,
      evaluationsCompleted,
      totalEvaluations,
    ] = await Promise.all([
      prisma.team.count(),
      prisma.user.count({ where: { role: "TEAM" } }),
      prisma.user.count({ where: { role: "MENTOR" } }),
      prisma.user.count({ where: { role: "JUDGE" } }),
      prisma.team.count({ where: { problemStatementId: { not: null } } }),
      prisma.team.count({ where: { submissionStatus: "SUBMITTED" } }),
      prisma.evaluation.count({ where: { status: "COMPLETED" } }),
      prisma.evaluation.count(),
    ]);

    // Problem statement statistics
    const psStats = await prisma.problemStatement.findMany({
      include: {
        domain: true,
        teams: {
          select: { id: true, name: true, teamId: true },
        },
        _count: {
          select: { teams: true },
        },
      },
    });

    return {
      stats: {
        totalTeams,
        totalParticipants,
        totalMentors,
        totalJudges,
        teamsWithPS,
        teamsSubmitted,
        evaluationsCompleted,
        totalEvaluations,
        evaluationProgress: totalEvaluations > 0 ? (evaluationsCompleted / totalEvaluations) * 100 : 0,
      },
      problemStatements: psStats,
    };
  }

  // Team Management
  async getAllTeams() {
    return prisma.team.findMany({
      include: {
        participants: {
          select: { id: true, username: true, email: true },
        },
        problemStatement: {
          include: { domain: true },
        },
        evaluations: {
          select: {
            id: true,
            status: true,
            judge: {
              include: {
                user: { select: { username: true } },
              },
            },
          },
        },
        submissions: {
          select: { id: true, githubRepo: true, presentationLink: true, submittedAt: true },
        },
        round1Room: {
          select: { id: true, name: true, block: true },
        },
        round2Room: {
          select: { id: true, name: true, block: true },
        },
        checkpoints: {
          select: { checkpoint: true, status: true, completedAt: true, data: true },
        }
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getTeamDetails(teamId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        participants: {
          select: { id: true, username: true, email: true },
        },
        problemStatement: {
          include: { domain: true },
        },
        evaluations: {
          include: {
            judge: {
              include: {
                user: { select: { username: true } },
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
                user: { select: { username: true } },
              },
            },
          },
        },
        round1Room: true,
        round2Room: true,
      },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    return team;
  }

  // Judge-Team Mapping (Admin View)
  async getJudgeTeamMappings() {
    const judges = await prisma.judge.findMany({
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        evaluations: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                teamId: true,
                problemStatement: {
                  include: { domain: true },
                },
              },
            },
          },
        },
        _count: {
          select: { evaluations: true },
        },
      },
    });

    return judges.map((judge) => ({
      judge: {
        id: judge.id,
        user: judge.user,
        expertise: judge.expertise,
      },
      assignedTeams: judge.evaluations.map((evaluation) => ({
        team: evaluation.team,
        evaluationStatus: evaluation.status,
        evaluationId: evaluation.id,
      })),
      totalAssigned: judge._count.evaluations,
      completedEvaluations: judge.evaluations.filter((e) => e.status === "COMPLETED").length,
    }));
  }

  async getJudgeDetails(judgeId: string) {
    const judge = await prisma.judge.findUnique({
      where: { id: judgeId },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        evaluations: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                teamId: true,
                submissionStatus: true,
                problemStatement: {
                  include: { domain: true },
                },
              },
            },
          },
        },
        round1Room: true,
        round2Room: true,
      },
    });

    if (!judge) {
      throw new Error("Judge not found");
    }

    return judge;
  }

  // User Management (Limited)
  async getAllUsers() {
    return prisma.user.findMany({
      where: {
        role: {
          in: ["TEAM", "MENTOR", "JUDGE"],
        }
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        participantTeam: {
          select: { id: true, name: true, teamId: true },
        },
        mentorProfile: {
          select: { id: true, expertise: true },
        },
        judgeProfile: {
          select: { id: true, expertise: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Activity Logs (Read Only)
  async getActivityLogs(filters?: LogFilter) {
    const where: any = {};

    if (filters?.action && filters.action !== "all") {
      where.action = { contains: filters.action, mode: "insensitive" };
    }

    if (filters?.userId && filters.userId !== "all") {
      where.userId = filters.userId;
    }

    if (filters?.startDate) {
      where.createdAt = { ...where.createdAt, gte: new Date(filters.startDate) };
    }

    if (filters?.endDate) {
      where.createdAt = { ...where.createdAt, lte: new Date(filters.endDate) };
    }

    return prisma.activityLog.findMany({
      where: {
        user: {
          role: {
            notIn: ['SUPER_ADMIN'],
          },
        },
        ...where,
      },
      include: {
        user: {
          select: { username: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 500, // Limit for admins
    });
  }

  // Announcements (Read Only)
  async getAllAnnouncements() {
    return prisma.announcement.findMany({
      include: {
        author: {
          select: { username: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Team Scores Overview (No detailed scores)
  async getTeamScoresOverview() {
    const teams = await prisma.team.findMany({
      include: {
        problemStatement: {
          include: { domain: true },
        },
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
      orderBy: { createdAt: "desc" },
    });

    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      teamId: team.teamId,
      roomNumber: team.roomNumber,
      status: team.status,
      submissionStatus: team.submissionStatus,
      problemStatement: team.problemStatement,
      evaluationStatus: {
        total: team.evaluations.length,
        completed: team.evaluations.filter((e) => e.status === "COMPLETED").length,
        pending: team.evaluations.filter((e) => e.status === "PENDING").length,
      },
      hasScores: team.teamScores.length > 0,
      judgedBy: team.evaluations.map((e) => e.judge.user.username),
    }));
  }

  // System Settings (Read Only)
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

  // Round 2 Management (Limited)
  async getRound2Rooms() {
    return prisma.round2Room.findMany({
      include: {
        teams: {
          select: { id: true, name: true, teamId: true },
        },
        judges: {
          include: {
            user: { select: { username: true } },
          },
        },
        _count: {
          select: { teams: true, judges: true },
        },
      },
    });
  }

  // Domains and Problem Statements (Read Only)
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
    });
  }

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

  // Update team checkpoint
  async updateTeamCheckpoint1(data: Checkpoint1Data) {
    const { teamId, wifi } = data;
    return prisma.teamCheckpoint.upsert({
      where: {
        teamId_checkpoint: {
          teamId,
          checkpoint: 1,
        },
      },
      update: {
        data: { wifi },
        status: "COMPLETED",
        completedAt: new Date(),
      },
      create: {
        teamId,
        checkpoint: 1,
        data: { wifi },
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });
  }

  async updateTeamCheckpoint2(payload: Checkpoint2Data) {
    const team = await prisma.team.findUnique({
      where: {id: payload.teamId},
    });
    if (!team) {
      throw new Error("Team not found");
    }

    const username = team.teamId;
    const password = Math.random().toString(36).slice(-6);
    const hash = await hashPassword(password);

    const t1 = prisma.user.create({
      data: {
        username,
        password: hash,
        role: "TEAM",
      },
      select: {
        username: true,
        password: true,
      }
    });
    const t2 = prisma.teamCheckpoint.upsert({
      where: {
        teamId_checkpoint: {
          teamId: payload.teamId,
          checkpoint: 2,
        },
      },
      update: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
      create: {
        teamId: payload.teamId,
        checkpoint: 2,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    const emptyRoom = await prisma.round1Room.findFirst({
      where: {
        teams: {
          none: {},
        },
      },
    })

    const t3 = prisma.team.update({
      where: {id: payload.teamId},
      data: {
        round1Room: {
          connect: {
            name: "001",
          },
        },
      },
      select: {round1Room: true},
    });

    const [user, checkpoint, round1Room] = await prisma.$transaction([t1, t2, t3]);
    return {
      username: user.username,
      round1Room,
      password,
      checkpoint,
    }
  }

  async updateTeamCheckpoint3(data: { teamId: string }) {
    const { teamId } = data;
    return prisma.teamCheckpoint.upsert({
      where: {
        teamId_checkpoint: {
          teamId,
          checkpoint: 1,
        },
      },
      update: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
      create: {
        teamId,
        checkpoint: 1,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });
  }

  // Get team checkpoints
  async getTeamCheckpoints(teamId: string) {
    return prisma.teamCheckpoint.findMany({
      where: {teamId},
      orderBy: {checkpoint: "asc"},
    });
  }

  async getAllJudges() {
    return prisma.judge.findMany({
      include: {
        user: {select: {id: true, username: true, role: true}},
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
}

export const adminService = new AdminService();
