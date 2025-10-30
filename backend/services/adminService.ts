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
    role?: "MEMBER" | "LEADER";
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
          select: {
            id: true,
            role: true,
            name: true,
            email: true,
            phone: true,
            verified: true,
          },
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
          select: {
            id: true,
            role: true,
            name: true,
            email: true,
            phone: true,
            verified: true,
          },
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
        participants: {
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

    // If checkpoint exists, use the participants from checkpoint data (which includes isPresent)
    // Otherwise, use participants from teamParticipants table
    let participantsData;
    if (existingData?.participants && Array.isArray(existingData.participants)) {
      // Use checkpoint data which has isPresent status
      participantsData = existingData.participants.map((p: any) => ({
        id: p.id || `cp-${p.email}`, // Use checkpoint participant id or generate one
        name: p.name,
        email: p.email,
        phone: p.phone || '',
        role: p.role,
        isPresent: p.isPresent || false,
        verified: p.isPresent || false,
      }));
    } else {
      // Use teamParticipants table data
      participantsData = team.participants.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone || '',
        role: p.role,
        isPresent: p.verified || false, // Use verified field as initial isPresent
        verified: p.verified,
      }));
    }

    return {
      id: team.id,
      name: team.name,
      teamId: team.teamId,
      participants: participantsData,
      wifi: existingData?.wifi || false,
      status: checkpoint1?.status || 'pending',
    };
  }

  async updateTeamCheckpoint1(data: Checkpoint1Data) {
    const {teamId, wifi, participants} = data;

    // Count present participants
    const presentParticipants = participants.filter(p => p.isPresent);
    const totalParticipants = participants.length;

    // Determine status based on attendance
    let status: "COMPLETED" | "PARTIALLY_COMPLETED" = "COMPLETED";
    let notes = "";

    if (presentParticipants.length < 2) {
      throw new Error("At least 2 participants must be marked as present to complete checkpoint 1");
    } else if (presentParticipants.length < totalParticipants) {
      status = "PARTIALLY_COMPLETED";
      notes = `Only ${presentParticipants.length} out of ${totalParticipants} participants were present`;
    }

    // Use transaction to ensure data consistency
    return prisma.$transaction(async (tx) => {
      // 1. Delete existing team participants
      await tx.teamParticipant.deleteMany({
        where: {teamId}
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
            verified: participant.isPresent || false, // Use Verified field to track presence
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
            notes: notes,
          },
          status: status,
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
            notes: notes,
          },
          status: status,
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
        verified: false,
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
    if (!team) throw new Error("Team not found");

    const username = team.teamId;
    let password = "";
    let isNewUser = false;

    // 1️⃣ Check user
    const existingUser = await prisma.user.findUnique({where: {username}});
    const existingCheckpoint = await prisma.teamCheckpoint.findUnique({
      where: {teamId_checkpoint: {teamId: payload.teamId, checkpoint: 2}},
    });

    if (
      existingUser &&
      existingCheckpoint?.data &&
      typeof existingCheckpoint.data === "object" &&
      "password" in existingCheckpoint.data
    ) {
      password = (existingCheckpoint.data as any).password;
    } else if (!existingUser) {
      password = Math.random().toString(36).slice(-6);
      const hash = await hashPassword(password);
      await prisma.user.create({
        data: {username, password: hash, role: "TEAM", teamId: payload.teamId},
      });
      isNewUser = true;
    } else {
      password = Math.random().toString(36).slice(-6);
      const hash = await hashPassword(password);
      await prisma.user.update({
        where: {username},
        data: {password: hash},
      });
    }

    // 2️⃣ Find an available room (FCFS)
    const availableRoom = await prisma.round1Room.findFirst({
      where: {
        filled: {lt: prisma.round1Room.fields.capacity},
      },
      orderBy: {id: "asc"}, // or sort numerically if your IDs aren't lexicographic
    });

    if (!availableRoom) {
      throw new Error("No available Round1Room found");
    }
    console.log('---------------------------------------------');
    console.log('available', availableRoom);
    console.log('---------------------------------------------');

    // 3️⃣ Create checkpoint + assign room atomically
    const [checkpoint, updatedTeam, updatedRoom] = await prisma.$transaction([
      prisma.teamCheckpoint.upsert({
        where: {teamId_checkpoint: {teamId: payload.teamId, checkpoint: 2}},
        update: {
          status: "COMPLETED",
          completedAt: new Date(),
          data: {password},
        },
        create: {
          teamId: payload.teamId,
          checkpoint: 2,
          status: "COMPLETED",
          completedAt: new Date(),
          data: {password},
        },
      }),
      prisma.team.update({
        where: {id: payload.teamId},
        data: {
          round1Room: {connect: {id: availableRoom.id}},
        },
      }),
      prisma.round1Room.update({
        where: {id: availableRoom.id},
        data: {filled: {increment: 1}},
      }),
    ]);

    return {
      username,
      password,
      checkpoint,
      round1Room: updatedRoom,
    };
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
    return prisma.$transaction(async (tx) => {
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
          status: "PARTIALLY_COMPLETED",
          completedAt: null,
        }
      });

      return {
        success: true,
        message: `Team ${team.teamId} has been refreshed back to checkpoint 1`
      };
    });
  }

  // Create a new team manually
  async createTeam(data: {
    teamName: string;
    teamLeader: {
      name: string;
      email: string;
      phone?: string;
    };
    teamMembers: Array<{
      name: string;
      email: string;
      phone?: string;
    }>;
  }) {
    return prisma.$transaction(async (tx) => {
      // Generate unique team ID
      const lastTeam = await tx.team.findFirst({
        select: {
          teamId: true,
        },
        orderBy: {createdAt: "desc"},
      });
      if (!lastTeam) {
        return; // not possible as we are importing teams
      }
      const count = parseInt(lastTeam.teamId.replace("TEAM", ""));
      let teamId = `TEAM${(count + 1).toString().padStart(3, "0")}`;

      // Generate a simple password for the team (can be changed later)
      const teamPassword = Math.random().toString(36).slice(-6);
      const hashedPassword = await hashPassword(teamPassword);

      // Create the team
      const team = await tx.team.create({
        data: {
          name: data.teamName,
          teamId: teamId,
          status: "REGISTERED",
          submissionStatus: "NOT_SUBMITTED",
        },
      });

      // Create team leader
      const teamLeader = await tx.teamParticipant.create({
        data: {
          teamId: team.id,
          name: data.teamLeader.name,
          email: data.teamLeader.email,
          phone: data.teamLeader.phone,
          role: "LEADER",
          verified: false,
        },
      });

      // Create team members
      const teamMembers = await Promise.all(
        data.teamMembers.map((member) =>
          tx.teamParticipant.create({
            data: {
              teamId: team.id,
              name: member.name,
              email: member.email,
              phone: member.phone,
              role: "MEMBER",
              verified: false,
            },
          })
        )
      );

      return {
        team,
        teamLeader,
        teamMembers,
        checkpoints: [],
      };
    });
  }

  // Delete a team and all its related data
  async deleteTeam(teamId: string) {
    return prisma.$transaction(async (tx) => {
      // Get team details for logging
      const team = await tx.team.findUnique({
        where: {id: teamId},
        select: {name: true, teamId: true}
      });

      if (!team) {
        throw new Error("Team not found");
      }

      // Delete in order to respect foreign key constraints

      // 1. Delete team checkpoints
      await tx.teamCheckpoint.deleteMany({
        where: {teamId}
      });

      // 2. Delete mentorship queue entries
      await tx.mentorshipQueue.deleteMany({
        where: {teamId}
      });

      // 3. Delete team scores
      await tx.teamScore.deleteMany({
        where: {teamId}
      });

      // 4. Delete evaluations
      await tx.evaluation.deleteMany({
        where: {teamId}
      });

      // 5. Delete submissions
      await tx.submission.deleteMany({
        where: {teamId}
      });

      // 6. Delete problem statement bookmarks for team users
      const teamUsers = await tx.user.findMany({
        where: {teamId},
        select: {id: true}
      });

      if (teamUsers.length > 0) {
        await tx.pSBookmark.deleteMany({
          where: {
            userId: {
              in: teamUsers.map(user => user.id)
            }
          }
        });
      }

      // 7. Delete team participants (this should cascade automatically, but let's be explicit)
      await tx.teamParticipant.deleteMany({
        where: {teamId}
      });

      // 8. Update users to remove team association
      await tx.user.updateMany({
        where: {teamId},
        data: {teamId: null}
      });

      // 9. Finally delete the team
      await tx.team.delete({
        where: {id: teamId}
      });

      return {
        success: true,
        message: `Team "${team.name}" (${team.teamId}) has been successfully deleted`
      };
    });
  }
}

export const adminService = new AdminService();