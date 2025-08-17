import { Router } from "express";
import { adminService } from "../services/adminService";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// Apply admin authentication to all routes
router.use(requireAdmin);

// Dashboard Overview
router.get("/overview", async (req, res) => {
  try {
    const overview = await adminService.getDashboardOverview();
    res.json(overview);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Team Management
router.get("/teams", async (req, res) => {
  try {
    const teams = await adminService.getAllTeams();
    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/teams/:teamId", async (req, res) => {
  try {
    const team = await adminService.getTeamDetails(req.params.teamId);
    res.json(team);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Judge-Team Mapping
router.get("/judge-mappings", async (req, res) => {
  try {
    const mappings = await adminService.getJudgeTeamMappings();
    res.json(mappings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/judges/:judgeId", async (req, res) => {
  try {
    const judge = await adminService.getJudgeDetails(req.params.judgeId);
    res.json(judge);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// User Management (Read Only)
router.get("/users", async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Activity Logs (Read Only)
router.get("/logs", async (req, res) => {
  try {
    const logs = await adminService.getActivityLogs(req.query as any);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Announcements (Read Only)
router.get("/announcements", async (req, res) => {
  try {
    const announcements = await adminService.getAllAnnouncements();
    res.json(announcements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Team Scores Overview (No detailed scores)
router.get("/team-scores", async (req, res) => {
  try {
    const scores = await adminService.getTeamScoresOverview();
    res.json(scores);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// System Settings (Read Only)
router.get("/settings", async (req, res) => {
  try {
    const settings = await adminService.getSystemSettings();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Round 2 Management (Read Only)
router.get("/round2/rooms", async (req, res) => {
  try {
    const rooms = await adminService.getRound2Rooms();
    res.json(rooms);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Domains and Problem Statements (Read Only)
router.get("/domains", async (req, res) => {
  try {
    const domains = await adminService.getDomains();
    res.json(domains);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/problem-statements", async (req, res) => {
  try {
    const problemStatements = await adminService.getProblemStatements();
    res.json(problemStatements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
