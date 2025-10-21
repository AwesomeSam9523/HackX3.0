import {PrismaClient} from "@prisma/client";
import type {LogFilter} from "../types";
import {hashPassword} from "../utils/password";

const prisma = new PrismaClient();

interface Checkpoint1Data {
  teamId: string;
  wifi: boolean;
  participants: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    role?: "MEMBER" | "TEAM_LEADER";
    isPresent: boolean;
  }[];
}

interface Checkpoint2Data {
  teamId: string;
}

interface ParticipantData {
  name: string;
  email: string;
  phone?: string;
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
      prisma.user.count({where: {role: "TEAM"}}),
      prisma.user.count({where: {role: "MENTOR"}}),
      prisma.user.count({where: {role: "JUDGE"}}),
      prisma.team.count({where: {problemStatementId: {not: null}}}),
      prisma.team.count({where: {submissionStatus: "SUBMITTED"}}),
      prisma.evaluation.count({where: {status: "COMPLETED"}}),
      prisma.evaluation.count(),
    ]);

    // Problem statement statistics
    const psStats = await prisma.problemStatement.findMany({
      include: {
        domain: true,
        teams: {
          select: {id: true, name: true, teamId: true},
        },
        _count: {
          select: {teams: true},
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
          select: {id: true, username: true, email: true},
        },
        problemStatement: {
          include: {domain: true},
        },
        evaluations: {
          select: {
            id: true,
            status: true,
            judge: {
              include: {
                user: {select: {username: true}},
              },
            },
          },
        },
        submissions: {
          select: {id: true, githubRepo: true, presentationLink: true, submittedAt: true},
        },
        round1Room: {
          select: {id: true, name: true, block: true},
        },
        round2Room: {
          select: {id: true, name: true, block: true},
        },
        checkpoints: {
          select: {checkpoint: true, status: true, completedAt: true, data: true},
        }
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
          select: {id: true, username: true, email: true},
        },
        evaluations: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                teamId: true,
                problemStatement: {
                  include: {domain: true},
                },
              },
            },
          },
        },
        _count: {
          select: {evaluations: true},
        },
      },
    });

    return judges.map((judge) => ({
      judge: {
        id: judge.id,
        user: judge.user,
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
      where: {id: judgeId},
      include: {
        user: {
          select: {id: true, username: true, email: true},
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
                  include: {domain: true},
                },
              },
            },
          },
        },
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

  // Activity Logs (Read Only)
  async getActivityLogs(filters?: LogFilter) {
    const where: any = {};

    if (filters?.action && filters.action !== "all") {
      where.action = {contains: filters.action, mode: "insensitive"};
    }

    if (filters?.userId && filters.userId !== "all") {
      where.userId = filters.userId;
    }

    if (filters?.startDate) {
      where.createdAt = {...where.createdAt, gte: new Date(filters.startDate)};
    }

    if (filters?.endDate) {
      where.createdAt = {...where.createdAt, lte: new Date(filters.endDate)};
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
          select: {username: true, role: true},
        },
      },
      orderBy: {createdAt: "desc"},
      take: 500, // Limit for admins
    });
  }

  // Announcements (Read Only)
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

  // Team Scores Overview (No detailed scores)
  async getTeamScoresOverview() {
    const teams = await prisma.team.findMany({
      include: {
        problemStatement: {
          include: {domain: true},
        },
        teamScores: {
          select: {
            id: true,
            totalScore: true,
            round: true,
            createdAt: true,
            judge: {
              include: {
                user: {select: {username: true}},
              },
            },
          },
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
          select: {
            block: true,
            name: true,
          }
        }
      },
      orderBy: {createdAt: "desc"},
    });

    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      teamId: team.teamId,
      roomNumber: `${team.round1Room?.block} ${team.round1Room?.name}`,
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
          select: {id: true, name: true, teamId: true},
        },
        _count: {
          select: {teams: true},
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
              select: {teams: true},
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
  async getTeamForCheckpoint1(teamId: string) {
    const team = await prisma.team.findUnique({
      where: {id: teamId},
      include: {
        teamParticipants: {
          orderBy: {createdAt: "asc"},
        },
        checkpoints: {
          where: {checkpoint: 1},
        },
      },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    // Get existing checkpoint 1 data if it exists
    const checkpoint1 = team.checkpoints.find(cp => cp.checkpoint === 1);
    const existingData = checkpoint1?.data as any;

    return {
      id: team.id,
      name: team.name,
      teamId: team.teamId,
      participants: team.teamParticipants.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone || '',
        role: p.role,
        isPresent: p.Verified, // Use Verified field for presence
      })),
      wifi: existingData?.wifi || false,
      status: checkpoint1?.status || 'pending',
    };
  }

  async updateTeamCheckpoint1(data: Checkpoint1Data) {
    const {teamId, wifi, participants} = data;
    
    // Validate that at least 2 participants are present
    const presentParticipants = participants.filter(p => p.isPresent);
    if (presentParticipants.length < 2) {
      throw new Error("At least 2 participants must be marked as present to complete checkpoint 1");
    }

    // Use transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
      // 1. Delete existing team participants
      await tx.teamParticipant.deleteMany({
        where: { teamId }
      });

      // 2. Create new team participants from the frontend data
      for (const participant of participants) {
        await tx.teamParticipant.create({
          data: {
            teamId,
            name: participant.name,
            email: participant.email,
            phone: participant.phone,
            role: participant.role || "MEMBER",
            Verified: participant.isPresent || false, // Use Verified field to track presence
          },
        });
      }

      // 3. Create or update checkpoint record
      return tx.teamCheckpoint.upsert({
        where: {
          teamId_checkpoint: {
            teamId,
            checkpoint: 1,
          },
        },
        update: {
          data: {
            wifi, 
            participants: participants.map(p => ({
              name: p.name,
              email: p.email,
              phone: p.phone,
              role: p.role,
              isPresent: p.isPresent,
            })),
            totalParticipants: participants.length,
            presentCount: presentParticipants.length,
          },
          status: "COMPLETED",
          completedAt: new Date(),
        },
        create: {
          teamId,
          checkpoint: 1,
          data: {
            wifi, 
            participants: participants.map(p => ({
              name: p.name,
              email: p.email,
              phone: p.phone,
              role: p.role,
              isPresent: p.isPresent,
            })),
            totalParticipants: participants.length,
            presentCount: presentParticipants.length,
          },
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
    });
  }

  async addParticipantToTeam(teamId: string, participantData: ParticipantData) {
    const team = await prisma.team.findUnique({
      where: {id: teamId},
    });

    if (!team) {
      throw new Error("Team not found");
    }

    return prisma.teamParticipant.create({
      data: {
        teamId,
        name: participantData.name,
        email: participantData.email,
        phone: participantData.phone,
        role: "MEMBER",
        Verified: false,
      },
    });
  }

  async removeParticipantFromTeam(participantId: string) {
    return prisma.teamParticipant.delete({
      where: {id: participantId},
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
      round1Room: round1Room.round1Room,
      password,
      checkpoint,
    }
  }

  async updateTeamCheckpoint3(data: { teamId: string }) {
    const {teamId} = data;
    return prisma.teamCheckpoint.upsert({
      where: {
        teamId_checkpoint: {
          teamId,
          checkpoint: 3,
        },
      },
      update: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
      create: {
        teamId,
        checkpoint: 3,
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
    const judges = await prisma.judge.findMany({
      include: {
        user: {select: {id: true, username: true, role: true}},
        evaluations: {
          select: {
            id: true,
            status: true,
          }
        }
      }
    });

    judges.forEach((judge) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      judge['teamsLeft'] = judge.evaluations.filter(e => e.status === 'PENDING').length;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      judge['teamsCompleted'] = judge.evaluations.filter(e => e.status === 'COMPLETED').length;
    })

    return judges;
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

  async getTeamJudgeMappings() {
    return prisma.evaluation.findMany({
      select: {
        id: true,
        status: true,
        team: {
          select: {id: true, name: true, teamId: true},
        },
        judge: {
          include: {
            user: {select: {username: true}},
          },
        },
      }
    });
  }

  // Refresh team back to checkpoint 1
  async refreshTeamToCheckpoint1(teamId: string) {
    const team = await prisma.team.findUnique({
      where: {id: teamId},
      select: {teamId: true, round1RoomId: true}
    });

    if (!team) {
      throw new Error("Team not found");
    }

    // Start transaction to refresh team to checkpoint 1
    const result = await prisma.$transaction(async (tx) => {
      // 1. Delete the team user account if it exists
      await tx.user.deleteMany({
        where: {
          username: team.teamId,
          role: "TEAM"
        }
      });

      // 2. Remove team from round1 room and update room filled count
      if (team.round1RoomId) {
        await tx.round1Room.update({
          where: {id: team.round1RoomId},
          data: {
            filled: {
              decrement: 1
            }
          }
        });
      }

      // 3. Update team to remove round1 room assignment
      await tx.team.update({
        where: {id: teamId},
        data: {
          round1RoomId: null
        }
      });

      // 4. Delete checkpoint 2 and 3 records
      await tx.teamCheckpoint.deleteMany({
        where: {
          teamId: teamId,
          checkpoint: {
            in: [2, 3]
          }
        }
      });

      // 5. Reset checkpoint 1 to pending if it exists
      await tx.teamCheckpoint.updateMany({
        where: {
          teamId: teamId,
          checkpoint: 1
        },
        data: {
          status: "pending",
          completedAt: null,
        }
      });

      return {
        success: true,
        message: `Team ${team.teamId} has been refreshed back to checkpoint 1`
      };
    });

    return result;
  }
}

export const adminService = new AdminService();
