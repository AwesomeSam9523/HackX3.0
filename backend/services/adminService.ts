import { PrismaClient } from "@prisma/client";
import type { LogFilter } from "../types";

const prisma = new PrismaClient();

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
      prisma.user.count({ where: { role: "PARTICIPANT" } }),
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
        round2Room: {
          select: { id: true, name: true, floor: true },
        },
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
        floor: judge.floor,
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
          select: { id: true, expertise: true, floor: true },
        },
        judgeProfile: {
          select: { id: true, expertise: true, floor: true },
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
      where,
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
        inProgress: team.evaluations.filter((e) => e.status === "IN_PROGRESS").length,
      },
      hasScores: team.teamScores.length > 0,
      averageScore:
        team.teamScores.length > 0
          ? team.teamScores.reduce((sum, score) => sum + (score.totalScore || 0), 0) / team.teamScores.length
          : null,
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

  async getProblemStatements() {
    return prisma.problemStatement.findMany({
      include: {
        domain: true,
        teams: {
          select: { id: true, name: true, teamId: true },
        },
        _count: {
          select: { teams: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const adminService = new AdminService();
