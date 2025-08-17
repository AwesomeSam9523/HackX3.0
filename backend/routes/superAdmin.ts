import { Router } from "express";
import { superAdminService } from "../services/superAdminService";
import { requireSuperAdmin } from "../middleware/auth";
import { modifyLimiter } from "../middleware/rateLimiter";
import { logActivity } from "../middleware/logging";
import type { AuthRequest } from "../middleware/auth";

const router = Router();

// Apply super admin authentication to all routes
router.use(requireSuperAdmin);

// User Management
router.get("/users", async (req, res) => {
  try {
    const users = await superAdminService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/users", modifyLimiter, logActivity("CREATE_USER"), async (req: AuthRequest, res) => {
  try {
    const user = await superAdminService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/users/:userId/toggle-status", modifyLimiter, logActivity("TOGGLE_USER_STATUS"), async (req, res) => {
  try {
    const user = await superAdminService.toggleUserStatus(req.params.userId);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/users/:userId", modifyLimiter, logActivity("DELETE_USER"), async (req, res) => {
  try {
    await superAdminService.deleteUser(req.params.userId);
    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Problem Statement Management
router.get("/problem-statements", async (req, res) => {
  try {
    const problemStatements = await superAdminService.getAllProblemStatements();
    res.json(problemStatements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/problem-statements", modifyLimiter, logActivity("CREATE_PROBLEM_STATEMENT"), async (req, res) => {
  try {
    const ps = await superAdminService.createProblemStatement(req.body);
    res.status(201).json(ps);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/problem-statements/:id", modifyLimiter, logActivity("UPDATE_PROBLEM_STATEMENT"), async (req, res) => {
  try {
    const ps = await superAdminService.updateProblemStatement(req.params.id, req.body);
    res.json(ps);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/problem-statements/:id", modifyLimiter, logActivity("DELETE_PROBLEM_STATEMENT"), async (req, res) => {
  try {
    await superAdminService.deleteProblemStatement(req.params.id);
    res.json({ message: "Problem statement deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/problem-statements/lock", modifyLimiter, logActivity("TOGGLE_PS_LOCK"), async (req, res) => {
  try {
    const result = await superAdminService.toggleProblemStatementLock(req.body.locked);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Team Management
router.get("/teams", async (req, res) => {
  try {
    const teams = await superAdminService.getAllTeams();
    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/teams/:teamId", async (req, res) => {
  try {
    const team = await superAdminService.getTeamDetails(req.params.teamId);
    res.json(team);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// System Settings
router.post("/mentorship/lock", modifyLimiter, logActivity("TOGGLE_MENTORSHIP_LOCK"), async (req, res) => {
  try {
    const result = await superAdminService.toggleMentorshipLock(req.body.locked);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/round1/lock", modifyLimiter, logActivity("TOGGLE_ROUND1_LOCK"), async (req, res) => {
  try {
    const result = await superAdminService.toggleRound1Lock(req.body.locked);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/settings", async (req, res) => {
  try {
    const settings = await superAdminService.getSystemSettings();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Activity Logs
router.get("/logs", async (req, res) => {
  try {
    const logs = await superAdminService.getActivityLogs(req.query as any);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Announcements
router.get("/announcements", async (req, res) => {
  try {
    const announcements = await superAdminService.getAllAnnouncements();
    res.json(announcements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/announcements", modifyLimiter, logActivity("CREATE_ANNOUNCEMENT"), async (req: AuthRequest, res) => {
  try {
    const announcement = await superAdminService.createAnnouncement(req.user!.userId, req.body);
    res.status(201).json(announcement);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Team-Judge Mapping
router.get("/team-judge-mappings", async (req, res) => {
  try {
    const mappings = await superAdminService.getTeamJudgeMappings();
    res.json(mappings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/team-judge-mappings", modifyLimiter, logActivity("MAP_TEAM_TO_JUDGE"), async (req, res) => {
  try {
    const mapping = await superAdminService.mapTeamToJudge(req.body.teamId, req.body.judgeId);
    res.status(201).json(mapping);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete(
  "/team-judge-mappings/:teamId/:judgeId",
  modifyLimiter,
  logActivity("REMOVE_TEAM_JUDGE_MAPPING"),
  async (req, res) => {
    try {
      await superAdminService.removeTeamJudgeMapping(req.params.teamId, req.params.judgeId);
      res.json({ message: "Mapping removed successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Round 2 Management
router.post("/round2/promote", modifyLimiter, logActivity("PROMOTE_TO_ROUND2"), async (req, res) => {
  try {
    await superAdminService.promoteTeamsToRound2(req.body.teamIds);
    res.json({ message: "Teams promoted to Round 2 successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/round2/rooms", async (req, res) => {
  try {
    const rooms = await superAdminService.getRound2Rooms();
    res.json(rooms);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/round2/rooms", modifyLimiter, logActivity("CREATE_ROUND2_ROOM"), async (req, res) => {
  try {
    const room = await superAdminService.createRound2Room(req.body);
    res.status(201).json(room);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/round2/assign-judge", modifyLimiter, logActivity("ASSIGN_JUDGE_TO_ROOM"), async (req, res) => {
  try {
    await superAdminService.assignJudgeToRoom(req.body.judgeId, req.body.roomId);
    res.json({ message: "Judge assigned to room successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/round2/assign-team", modifyLimiter, logActivity("ASSIGN_TEAM_TO_ROOM"), async (req, res) => {
  try {
    await superAdminService.assignTeamToRoom(req.body.teamId, req.body.roomId);
    res.json({ message: "Team assigned to room successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
