import {PrismaClient} from "@prisma/client";
import type {TeamScoreRequest} from "../types";

const prisma = new PrismaClient();

type ScoreKeys =
  | "innovation"
  | "technical"
  | "presentation"
  | "feasibility"
  | "impact";

interface Criterion {
  id: ScoreKeys;
  name: string;
  weight: number;
  maxScore: number;
}

const scoringCriteria: Criterion[] = [
  {
    id: "innovation",
    name: "Innovation & Creativity",
    weight: 25,
    maxScore: 10,
  },
  {
    id: "technical",
    name: "Technical Implementation",
    weight: 30,
    maxScore: 10,
  },
  {
    id: "presentation",
    name: "Presentation Quality",
    weight: 15,
    maxScore: 10,
  },
  {
    id: "feasibility",
    name: "Feasibility of the Project",
    weight: 15,
    maxScore: 10,
  },
  {
    id: "impact",
    name: "Impact on Real Life",
    weight: 15,
    maxScore: 10,
  },
];

export class JudgeService {
  // Get judge profile and assigned teams
  async getJudgeProfile(userId: string) {
    const judge = await prisma.judge.findUnique({
      where: {userId},
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
                submissions: {
                  select: {githubRepo: true, presentationLink: true, submittedAt: true},
                  orderBy: {submittedAt: "desc"},
                  take: 1,
                },
              },
            }
          },
        },
      },
    });

    if (!judge) {
      throw new Error("Judge profile not found");
    }

    return judge;
  }

  // Get teams assigned to judge
  async getAssignedTeams(userId: string) {
    const judge = await prisma.judge.findUnique({
      where: {userId},
    });

    if (!judge) {
      throw new Error("Judge profile not found");
    }

    const evaluations = await prisma.evaluation.findMany({
      where: {judgeId: judge.id},
      include: {
        team: {
          select: {
            id: true,
            name: true,
            status: true,
            participants: {
              select: {id: true, name: true, email: true},
            },
            problemStatement: {
              include: {domain: true},
            },
            submissions: {
              select: {githubRepo: true, presentationLink: true, submittedAt: true},
              orderBy: {submittedAt: "desc"},
              take: 1,
            },
            teamScores: {
              where: {judgeId: judge.id},
              select: {
                id: true,
                totalScore: true,
                round: true,
                createdAt: true,
              },
            },
            round1Room: {
              select: {
                id: true,
                name: true,
                block: true,
              },
            },
          },
        },
      },
      orderBy: {createdAt: "asc"},
    });

    return evaluations
      .map((evaluation) => ({
        evaluationId: evaluation.id,
        evaluationStatus: evaluation.status,
        evaluated: evaluation.status === "COMPLETED",
        round: evaluation.round,
        team: {
          ...evaluation.team,
          hasScore: evaluation.team.teamScores.length > 0,
          latestScore: evaluation.team.teamScores[0] || null,
          submissionStatus:
            evaluation.team.submissions.length > 0 ? "SUBMITTED" : "NOT_SUBMITTED",
          latestSubmission: evaluation.team.submissions[0] || null,
        },
      }))
      .sort((a, b) => {
        const numA = parseInt(a.team.round1Room?.name || "0", 10);
        const numB = parseInt(b.team.round1Room?.name || "0", 10);
        return numA - numB; // ascending numeric order
      });
  }

  // Get specific team details for evaluation
  async getTeamForEvaluation(userId: string, teamId: string) {
    const judge = await prisma.judge.findUnique({
      where: {userId},
    });

    if (!judge) {
      throw new Error("Judge profile not found");
    }

    // Check if judge is assigned to this team
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        teamId_judgeId_round: {
          teamId,
          judgeId: judge.id,
          round: 1, // For now, assuming round 1
        },
      },
      include: {
        team: {
          include: {
            participants: {
              select: {id: true, name: true, email: true},
            },
            problemStatement: {
              include: {domain: true},
            },
            submissions: {
              orderBy: {submittedAt: "desc"},
            },
            checkpoints: {
              orderBy: {checkpoint: "asc"},
            },
          },
        },
      },
    });

    if (!evaluation) {
      throw new Error("Team not assigned to this judge or evaluation not found");
    }

    return {
      evaluation,
      team: evaluation.team,
    };
  }

  // Submit or update team score
  async submitTeamScore(userId: string, scoreData: TeamScoreRequest) {
    const {teamId, scores} = scoreData;

    const judge = await prisma.judge.findUnique({
      where: {userId},
    });

    if (!judge) {
      throw new Error("Judge profile not found");
    }

    // Check if judge is assigned to this team
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        teamId_judgeId_round: {
          teamId,
          judgeId: judge.id,
          round: 1,
        },
      },
    });

    if (!evaluation) {
      throw new Error("Team not assigned to this judge");
    }

    // Calculate total score
    let totalWeightedScore = 0;

    scoringCriteria.forEach((criteria) => {
      const score = scores[criteria.id] || 0;
      totalWeightedScore += (score * criteria.weight) / 100;
    });
    const totalScore = parseFloat(totalWeightedScore.toFixed(1));

    // Create or update team score
    const teamScore = await prisma.teamScore.upsert({
      where: {
        teamId_judgeId_round: {
          teamId,
          judgeId: judge.id,
          round: 1,
        },
      },
      update: {
        innovation: scores.innovation,
        technical: scores.technical,
        presentation: scores.presentation,
        impact: scores.impact,
        feasibility: scores.feasibility,
        totalScore,
        feedback: scores.feedback,
      },
      create: {
        teamId,
        judgeId: judge.id,
        innovation: scores.innovation,
        technical: scores.technical,
        presentation: scores.presentation,
        impact: scores.impact,
        feasibility: scores.feasibility,
        totalScore,
        feedback: scores.feedback,
        round: 1,
      },
    });

    // Update evaluation status to completed
    await prisma.evaluation.update({
      where: {id: evaluation.id},
      data: {status: "COMPLETED"},
    });

    return teamScore;
  }

  // Get existing score for a team
  async getTeamScore(userId: string, teamId: string) {
    const judge = await prisma.judge.findUnique({
      where: {userId},
    });

    if (!judge) {
      throw new Error("Judge profile not found");
    }

    return prisma.teamScore.findUnique({
      where: {
        teamId_judgeId_round: {
          teamId,
          judgeId: judge.id,
          round: 1,
        },
      },
    });
  }

  // Update evaluation status
  async updateEvaluationStatus(userId: string, teamId: string, status: "PENDING" | "COMPLETED") {
    const judge = await prisma.judge.findUnique({
      where: {userId},
    });

    if (!judge) {
      throw new Error("Judge profile not found");
    }

    const evaluation = await prisma.evaluation.findUnique({
      where: {
        teamId_judgeId_round: {
          teamId,
          judgeId: judge.id,
          round: 1,
        },
      },
    });

    if (!evaluation) {
      throw new Error("Evaluation not found");
    }

    return prisma.evaluation.update({
      where: {id: evaluation.id},
      data: {status},
    });
  }

  // Get judge's evaluation history
  async getEvaluationHistory(userId: string) {
    const judge = await prisma.judge.findUnique({
      where: {userId},
    });

    if (!judge) {
      throw new Error("Judge profile not found");
    }

    const evaluations = await prisma.evaluation.findMany({
      where: {judgeId: judge.id},
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
      orderBy: {updatedAt: "desc"},
    });

    const teamScores = await prisma.teamScore.findMany({
      where: {judgeId: judge.id},
      include: {
        team: {
          select: {
            id: true,
            name: true,
            teamId: true,
          },
        },
      },
      orderBy: {createdAt: "desc"},
    });

    return {
      evaluations,
      scores: teamScores,
      stats: {
        totalAssigned: evaluations.length,
        completed: evaluations.filter((e) => e.status === "COMPLETED").length,
        pending: evaluations.filter((e) => e.status === "PENDING").length,
      },
    };
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

  // Get all judges (for reference)
  async getAllJudges() {
    return prisma.judge.findMany({
      include: {
        user: {
          select: {id: true, username: true, email: true},
        },
        _count: {
          select: {evaluations: true},
        },
      },
    });
  }
}

export const judgeService = new JudgeService();
