import { Router } from "express";
import { adminService } from "../services/adminService";
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



export default router;
