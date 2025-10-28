import {Router} from "express";
import {superAdminService} from "../services/superAdminService";
import type {AuthRequest} from "../middleware/auth";
import {requireSuperAdmin} from "../middleware/auth";
import {modifyLimiter} from "../middleware/rateLimiter";
import {logActivity} from "../middleware/logging";

const router = Router();

// Apply super admin authentication to all routes
router.use(requireSuperAdmin);

// User Management
router.get("/users", async (req: AuthRequest, res, next) => {
  try {
    const users = await superAdminService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    next(error)
  }
});

router.post("/users", modifyLimiter, logActivity("CREATE_USER"), async (req: AuthRequest, res, next) => {
  try {
    const user = await superAdminService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    next(error)
  }
});

router.post("/users/:userId/toggle", modifyLimiter, logActivity("TOGGLE_USER_STATUS"), async (req: AuthRequest, res, next) => {
  try {
    const user = await superAdminService.toggleUserStatus(req.params.userId);
    res.json(user);
  } catch (error: any) {
    next(error)
  }
});

router.delete("/users/:userId", modifyLimiter, logActivity("DELETE_USER"), async (req: AuthRequest, res, next) => {
  try {
    await superAdminService.deleteUser(req.params.userId);
    res.json({message: "User deleted successfully"});
  } catch (error: any) {
    next(error)
  }
});

// Problem Statement Management
router.get("/problem-statements", async (req: AuthRequest, res, next) => {
  try {
    const problemStatements = await superAdminService.getAllProblemStatements();
    res.json(problemStatements);
  } catch (error: any) {
    next(error)
  }
});

router.post("/problem-statements", modifyLimiter, logActivity("CREATE_PROBLEM_STATEMENT"), async (req: AuthRequest, res, next) => {
  try {
    const ps = await superAdminService.createProblemStatement(req.body);
    res.status(201).json(ps);
  } catch (error: any) {
    next(error)
  }
});

router.put("/problem-statements/:id", modifyLimiter, logActivity("UPDATE_PROBLEM_STATEMENT"), async (req: AuthRequest, res, next) => {
  try {
    const ps = await superAdminService.updateProblemStatement(req.params.id, req.body);
    res.json(ps);
  } catch (error: any) {
    next(error)
  }
});

router.delete("/problem-statements/:id", modifyLimiter, logActivity("DELETE_PROBLEM_STATEMENT"), async (req: AuthRequest, res, next) => {
  try {
    await superAdminService.deleteProblemStatement(req.params.id);
    res.json({message: "Problem statement deleted successfully"});
  } catch (error: any) {
    next(error)
  }
});

router.post("/problem-statements/lock", modifyLimiter, logActivity("TOGGLE_PS_LOCK"), async (req: AuthRequest, res, next) => {
  try {
    const result = await superAdminService.toggleProblemStatementLock(req.body.locked);
    res.json(result);
  } catch (error: any) {
    next(error)
  }
});

// Team Management
router.get("/teams", async (req: AuthRequest, res, next) => {
  try {
    const teams = await superAdminService.getAllTeams();
    res.json(teams);
  } catch (error: any) {
    next(error)
  }
});

router.get("/domains", async (req: AuthRequest, res, next) => {
  try {
    const domains = await superAdminService.getDomains();
    res.json(domains);
  } catch (error: any) {
    next(error)
  }
});

router.get("/teams/:teamId", async (req: AuthRequest, res, next) => {
  try {
    const team = await superAdminService.getTeamDetails(req.params.teamId);
    res.json(team);
  } catch (error: any) {
    next(error)
  }
});

// Get team details for checkpoint 1
router.get("/team/:teamId/checkpoint1", async (req: AuthRequest, res, next) => {
  try {
    const teamDetails = await superAdminService.getTeamForCheckpoint1(req.params.teamId);
    res.json(teamDetails);
  } catch (error: any) {
    next(error)
  }
});

// Update team checkpoint 1
router.post(
  "/teams/checkpoint/1",
  logActivity("UPDATE_CHECKPOINT"),
  async (req: AuthRequest, res, next) => {
    try {
      const result = await superAdminService.updateTeamCheckpoint1(req.body);
      res.json(result);
    } catch (error: any) {
      next(error)
    }
  },
);

// Update team checkpoint 2
router.post(
  "/teams/checkpoint/2",
  logActivity("UPDATE_CHECKPOINT"),
  async (req: AuthRequest, res, next) => {
    try {
      const result = await superAdminService.updateTeamCheckpoint2(req.body);
      res.json(result);
    } catch (error: any) {
      next(error)
    }
  },
);

// Update team checkpoint 3
router.post(
  "/teams/checkpoint/3",
  logActivity("UPDATE_CHECKPOINT"),
  async (req: AuthRequest, res, next) => {
    try {
      const result = await superAdminService.updateTeamCheckpoint3(req.body);
      res.json(result);
    } catch (error: any) {
      next(error)
    }
  },
);

// System Settings
router.post("/mentorship/lock", modifyLimiter, logActivity("TOGGLE_MENTORSHIP_LOCK"), async (req: AuthRequest, res, next) => {
  try {
    const result = await superAdminService.toggleMentorshipLock(req.body.locked);
    res.json(result);
  } catch (error: any) {
    next(error)
  }
});

router.post("/round1/lock", modifyLimiter, logActivity("TOGGLE_ROUND1_LOCK"), async (req: AuthRequest, res, next) => {
  try {
    const result = await superAdminService.toggleRound1Lock(req.body.locked);
    res.json(result);
  } catch (error: any) {
    next(error)
  }
});

router.get("/settings", async (req: AuthRequest, res, next) => {
  try {
    const settings = await superAdminService.getSystemSettings();
    res.json(settings);
  } catch (error: any) {
    next(error)
  }
});

router.get("/mentors", async (req: AuthRequest, res, next) => {
  try {
    const mentors = await superAdminService.getAllMentors();
    res.json(mentors);
  } catch (error: any) {
    next(error)
  }
});

router.post("/mentors", logActivity("CREATE_MENTOR"), async (req: AuthRequest, res, next) => {
  try {
    const mentor = await superAdminService.createMentor(req.body);
    res.status(201).json(mentor);
  } catch (error: any) {
    next(error)
  }
})

router.delete("/mentors/:mentorId", modifyLimiter, logActivity("DELETE_MENTOR"), async (req: AuthRequest, res, next) => {
  try {
    await superAdminService.deleteMentor(req.params.mentorId);
    res.json({message: "Mentor deleted successfully"});
  } catch (error: any) {
    next(error)
  }
})

// Activity Logs
router.get("/logs", async (req: AuthRequest, res, next) => {
  try {
    const logs = await superAdminService.getActivityLogs(req.query as any);
    res.json(logs);
  } catch (error: any) {
    next(error)
  }
});

// Announcements
router.get("/announcements", async (req: AuthRequest, res, next) => {
  try {
    const announcements = await superAdminService.getAllAnnouncements();
    res.json(announcements);
  } catch (error: any) {
    next(error)
  }
});

router.post("/announcements", modifyLimiter, logActivity("CREATE_ANNOUNCEMENT"), async (req: AuthRequest, res, next) => {
  try {
    const announcement = await superAdminService.createAnnouncement(req.user!.id, req.body);
    res.status(201).json(announcement);
  } catch (error: any) {
    next(error)
  }
});

// Team-Judge Mapping
router.get("/team-judge-mappings", async (req, res, next) => {
  try {
    const mappings = await superAdminService.getTeamJudgeMappings();
    res.json(mappings);
  } catch (error: any) {
    next(error);
  }
});

router.post("/team-judge-mappings", modifyLimiter, logActivity("MAP_TEAM_TO_JUDGE"), async (req: AuthRequest, res, next) => {
  try {
    const mapping = await superAdminService.mapTeamToJudge(req.body.teamId, req.body.judgeId);
    res.status(201).json(mapping);
  } catch (error: any) {
    next(error)
  }
});

router.delete(
  "/team-judge-mappings/:teamId/:judgeId",
  logActivity("REMOVE_TEAM_JUDGE_MAPPING"),
  async (req: AuthRequest, res, next) => {
    try {
      await superAdminService.removeTeamJudgeMapping(req.params.teamId, req.params.judgeId);
      res.json({message: "Mapping removed successfully"});
    } catch (error: any) {
      next(error)
    }
  },
);

router.get("/judges", async (req: AuthRequest, res, next) => {
  try {
    const judges = await superAdminService.getAllJudges();
    res.json(judges);
  } catch (error: any) {
    next(error)
  }
});

router.post("/judges", logActivity("ADD_JUDGE"), async (req: AuthRequest, res, next) => {
  try {
    const judges = await superAdminService.addJudge(req.body);
    res.json(judges);
  } catch (error: any) {
    next(error)
  }
});

router.delete("/judges/:judgeId", logActivity("REMOVE_JUDGE"), async (req: AuthRequest, res, next) => {
  try {
    await superAdminService.deleteJudge(req.params.judgeId);
    res.json({message: "Judge removed successfully"});
  } catch (error: any) {
    next(error)
  }
});

router.get("/team-scores", async (req: AuthRequest, res, next) => {
  try {
    const scores = await superAdminService.getTeamScores();
    res.json(scores);
  }
  catch (error: any) {
    next(error)
  }
});


// Round 2 Management
router.post("/round2/promote", modifyLimiter, logActivity("PROMOTE_TO_ROUND2"), async (req: AuthRequest, res, next) => {
  try {
    await superAdminService.promoteTeamsToRound2(req.body.teamIds);
    res.json({message: "Teams promoted to Round 2 successfully"});
  } catch (error: any) {
    next(error)
  }
});

router.get("/round2/rooms", async (req: AuthRequest, res, next) => {
  try {
    const rooms = await superAdminService.getRound2Rooms();
    res.json(rooms);
  } catch (error: any) {
    next(error)
  }
});

router.post("/round2/rooms", modifyLimiter, logActivity("CREATE_ROUND2_ROOM"), async (req: AuthRequest, res, next) => {
  try {
    const room = await superAdminService.createRound2Room(req.body);
    res.status(201).json(room);
  } catch (error: any) {
    next(error)
  }
});

router.post("/round2/assign-judge", modifyLimiter, logActivity("ASSIGN_JUDGE_TO_ROOM"), async (req: AuthRequest, res, next) => {
  try {
    await superAdminService.assignJudgeToRoom(req.body.judgeId, req.body.roomId);
    res.json({message: "Judge assigned to room successfully"});
  } catch (error: any) {
    next(error)
  }
});

router.post("/round2/assign-team", modifyLimiter, logActivity("ASSIGN_TEAM_TO_ROOM"), async (req: AuthRequest, res, next) => {
  try {
    await superAdminService.assignTeamToRoom(req.body.teamId, req.body.roomId);
    res.json({message: "Team assigned to room successfully"});
  } catch (error: any) {
    next(error)
  }
});

export default router;
