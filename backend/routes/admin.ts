import {Router} from "express";
import {adminService} from "../services/adminService";
import {teamService} from "../services/teamService";
import {AuthRequest, requireAdmin} from "../middleware/auth";
import {logActivity} from "../middleware/logging";

const router = Router();

// Apply admin authentication to all routes
router.use(requireAdmin);

// Dashboard Overview
router.get("/overview", async (req: AuthRequest, res, next) => {
  try {
    const overview = await adminService.getDashboardOverview();
    res.json(overview);
  } catch (error: any) {
    next(error)
  }
});

// Team Management
router.get("/teams", async (req: AuthRequest, res, next) => {
  try {
    const teams = await adminService.getAllTeams();
    res.json(teams);
  } catch (error: any) {
    next(error)
  }
});

router.get("/teams/:teamId", async (req: AuthRequest, res, next) => {
  try {
    const team = await adminService.getTeamDetails(req.params.teamId);
    res.json(team);
  } catch (error: any) {
    next(error)
  }
});

// Judge-Team Mapping
router.get("/judge-mappings", async (req: AuthRequest, res, next) => {
  try {
    const mappings = await adminService.getJudgeTeamMappings();
    res.json(mappings);
  } catch (error: any) {
    next(error)
  }
});

router.get("/judges/:judgeId", async (req: AuthRequest, res, next) => {
  try {
    const judge = await adminService.getJudgeDetails(req.params.judgeId);
    res.json(judge);
  } catch (error: any) {
    next(error)
  }
});

// User Management (Read Only)
router.get("/users", async (req: AuthRequest, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    next(error)
  }
});

// Activity Logs (Read Only)
router.get("/logs", async (req: AuthRequest, res, next) => {
  try {
    const logs = await adminService.getActivityLogs(req.query as any);
    res.json(logs);
  } catch (error: any) {
    next(error)
  }
});

// Announcements (Read Only)
router.get("/announcements", async (req: AuthRequest, res, next) => {
  try {
    const announcements = await adminService.getAllAnnouncements();
    res.json(announcements);
  } catch (error: any) {
    next(error)
  }
});

// Team Scores Overview (No detailed scores)
router.get("/team-scores", async (req: AuthRequest, res, next) => {
  try {
    const scores = await adminService.getTeamScoresOverview();
    res.json(scores);
  } catch (error: any) {
    next(error)
  }
});

// System Settings (Read Only)
router.get("/settings", async (req: AuthRequest, res, next) => {
  try {
    const settings = await adminService.getSystemSettings();
    res.json(settings);
  } catch (error: any) {
    next(error)
  }
});

// Round 2 Management (Read Only)
router.get("/round2/rooms", async (req: AuthRequest, res, next) => {
  try {
    const rooms = await adminService.getRound2Rooms();
    res.json(rooms);
  } catch (error: any) {
    next(error)
  }
});

// Domains and Problem Statements (Read Only)
router.get("/domains", async (req: AuthRequest, res, next) => {
  try {
    const domains = await adminService.getDomains();
    res.json(domains);
  } catch (error: any) {
    next(error)
  }
});

router.get("/problem-statements", async (req: AuthRequest, res, next) => {
  try {
    const problemStatements = await adminService.getAllProblemStatements();
    res.json(problemStatements);
  } catch (error: any) {
    next(error)
  }
});

// Update team checkpoint
router.post(
  "/teams/checkpoint/1",
  logActivity("UPDATE_CHECKPOINT"),
  async (req: AuthRequest, res, next) => {
    try {
      const result = await adminService.updateTeamCheckpoint1(req.body);
      res.json(result);
    } catch (error: any) {
      next(error)
    }
  },
);

router.post(
  "/teams/checkpoint/2",
  logActivity("UPDATE_CHECKPOINT"),
  async (req: AuthRequest, res, next) => {
    try {
      const result = await adminService.updateTeamCheckpoint2(req.body);
      res.json(result);
    } catch (error: any) {
      next(error)
    }
  },
);

router.post(
  "/teams/checkpoint/3",
  logActivity("UPDATE_CHECKPOINT"),
  async (req: AuthRequest, res, next) => {
    try {
      const result = await adminService.updateTeamCheckpoint3(req.body);
      res.json(result);
    } catch (error: any) {
      next(error)
    }
  },
);

// Get team checkpoints
router.get("/team/:teamId/checkpoints", async (req: AuthRequest, res, next) => {
  try {
    const checkpoints = await adminService.getTeamCheckpoints(req.params.teamId);
    res.json(checkpoints);
  } catch (error: any) {
    next(error)
  }
});

// Get team details for checkpoint 1
router.get("/team/:teamId/checkpoint1", async (req: AuthRequest, res, next) => {
  try {
    const teamDetails = await adminService.getTeamForCheckpoint1(req.params.teamId);
    res.json(teamDetails);
  } catch (error: any) {
    next(error)
  }
});

// Add participant to team
router.post(
  "/team/:teamId/participants",
  logActivity("ADD_PARTICIPANT"),
  async (req: AuthRequest, res, next) => {
    try {
      const participant = await adminService.addParticipantToTeam(req.params.teamId, req.body);
      res.json(participant);
    } catch (error: any) {
      next(error)
    }
  },
);

// Remove participant from team
router.delete(
  "/participants/:participantId",
  logActivity("REMOVE_PARTICIPANT"),
  async (req: AuthRequest, res, next) => {
    try {
      await adminService.removeParticipantFromTeam(req.params.participantId);
      res.json({ success: true, message: "Participant removed successfully" });
    } catch (error: any) {
      next(error)
    }
  },
);

// Get team participants
router.get("/team/:teamId/participants", async (req: AuthRequest, res, next) => {
  try {
    const participants = await teamService.getTeamParticipants(req.params.teamId);
    res.json(participants);
  } catch (error: any) {
    next(error);
  }
});

// Add new team participant
router.post(
  "/team/:teamId/participants/new",
  logActivity("ADD_TEAM_PARTICIPANT"),
  async (req: AuthRequest, res, next) => {
    try {
      const participant = await teamService.addTeamParticipant(req.params.teamId, req.body);
      res.json(participant);
    } catch (error: any) {
      next(error);
    }
  }
);

// Update team participant
router.put(
  "/participants/:participantId/update",
  logActivity("UPDATE_TEAM_PARTICIPANT"),
  async (req: AuthRequest, res, next) => {
    try {
      const participant = await teamService.updateTeamParticipant(req.params.participantId, req.body);
      res.json(participant);
    } catch (error: any) {
      next(error);
    }
  }
);

// Delete team participant
router.delete(
  "/participants/:participantId/delete",
  logActivity("DELETE_TEAM_PARTICIPANT"),
  async (req: AuthRequest, res, next) => {
    try {
      await teamService.deleteTeamParticipant(req.params.participantId);
      res.json({ success: true, message: "Participant deleted successfully" });
    } catch (error: any) {
      next(error);
    }
  }
);

// Toggle participant presence
router.patch(
  "/participants/:participantId/presence",
  logActivity("TOGGLE_PARTICIPANT_PRESENCE"),
  async (req: AuthRequest, res, next) => {
    try {
      const { isPresent } = req.body;
      const participant = await teamService.toggleParticipantPresence(req.params.participantId, isPresent);
      res.json(participant);
    } catch (error: any) {
      next(error);
    }
  }
);

// Refresh team back to checkpoint 1
router.post(
  "/team/:teamId/refresh-to-checkpoint-1",
  logActivity("REFRESH_TEAM_CHECKPOINT"),
  async (req: AuthRequest, res, next) => {
    try {
      const result = await adminService.refreshTeamToCheckpoint1(req.params.teamId);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

router.get("/judges", async (req: AuthRequest, res, next) => {
  try {
    const judges = await adminService.getAllJudges();
    res.json(judges);
  } catch (error: any) {
    next(error)
  }
});

router.get("/mentors", async (req: AuthRequest, res, next) => {
  try {
    const judges = await adminService.getAllMentors();
    res.json(judges);
  } catch (error: any) {
    next(error)
  }
});

router.get("/team-judge-mappings", async (req, res, next) => {
  try {
    const mappings = await adminService.getTeamJudgeMappings();
    res.json(mappings);
  } catch (error: any) {
    next(error);
  }
});

// Create a new team manually
router.post(
  "/teams/create",
  logActivity("CREATE_TEAM"),
  async (req: AuthRequest, res, next) => {
    try {
      const result = await adminService.createTeam(req.body);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

// Delete a team
router.delete(
  "/teams/:teamId",
  logActivity("DELETE_TEAM"),
  async (req: AuthRequest, res, next) => {
    try {
      const result = await adminService.deleteTeam(req.params.teamId);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
