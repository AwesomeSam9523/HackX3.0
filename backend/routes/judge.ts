import { Router } from "express";
import { judgeService } from "../services/judgeService";
import { requireJudge } from "../middleware/auth";
import { modifyLimiter } from "../middleware/rateLimiter";
import { logActivity } from "../middleware/logging";
import type { AuthRequest } from "../middleware/auth";

const router = Router();

// Apply judge authentication to all routes
router.use(requireJudge);

// Get judge profile
router.get("/profile", async (req: AuthRequest, res) => {
  try {
    const profile = await judgeService.getJudgeProfile(req.user!.userId);
    res.json(profile);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Get assigned teams
router.get("/teams", async (req: AuthRequest, res) => {
  try {
    const teams = await judgeService.getAssignedTeams(req.user!.userId);
    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific team for evaluation
router.get("/teams/:teamId", async (req: AuthRequest, res) => {
  try {
    const teamData = await judgeService.getTeamForEvaluation(req.user!.userId, req.params.teamId);
    res.json(teamData);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Submit team score
router.post("/score", modifyLimiter, logActivity("SUBMIT_TEAM_SCORE"), async (req: AuthRequest, res) => {
  try {
    const score = await judgeService.submitTeamScore(req.user!.userId, req.body);
    res.json(score);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get team score
router.get("/teams/:teamId/score", async (req: AuthRequest, res) => {
  try {
    const score = await judgeService.getTeamScore(req.user!.userId, req.params.teamId);
    if (!score) {
      return res.status(404).json({ error: "Score not found" });
    }
    res.json(score);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Update evaluation status
router.post(
  "/teams/:teamId/evaluation-status",
  modifyLimiter,
  logActivity("UPDATE_EVALUATION_STATUS"),
  async (req: AuthRequest, res) => {
    try {
      const { status } = req.body;
      const evaluation = await judgeService.updateEvaluationStatus(req.user!.userId, req.params.teamId, status);
      res.json(evaluation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Get evaluation history
router.get("/history", async (req: AuthRequest, res) => {
  try {
    const history = await judgeService.getEvaluationHistory(req.user!.userId);
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get announcements
router.get("/announcements", async (req, res) => {
  try {
    const announcements = await judgeService.getAnnouncements();
    res.json(announcements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all judges (for reference)
router.get("/all", async (req, res) => {
  try {
    const judges = await judgeService.getAllJudges();
    res.json(judges);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
