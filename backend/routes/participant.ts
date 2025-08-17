import { Router } from "express";
import { participantService } from "../services/participantService";
import { requireParticipant } from "../middleware/auth";
import { modifyLimiter } from "../middleware/rateLimiter";
import { logActivity } from "../middleware/logging";
import type { AuthRequest } from "../middleware/auth";

const router = Router();

// Apply participant authentication to all routes
router.use(requireParticipant);

// Get team information
router.get("/team", async (req: AuthRequest, res) => {
  try {
    const team = await participantService.getTeamInfo(req.user!.userId);
    res.json(team);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Get domains with problem statements
router.get("/domains", async (req, res) => {
  try {
    const domains = await participantService.getDomains();
    res.json(domains);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all problem statements
router.get("/problem-statements", async (req, res) => {
  try {
    const problemStatements = await participantService.getProblemStatements();
    res.json(problemStatements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Select problem statement
router.post(
  "/problem-statements/select",
  modifyLimiter,
  logActivity("SELECT_PROBLEM_STATEMENT"),
  async (req: AuthRequest, res) => {
    try {
      const { problemStatementId } = req.body;
      const team = await participantService.selectProblemStatement(req.user!.userId, problemStatementId);
      res.json(team);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Bookmark problem statement
router.post(
  "/problem-statements/bookmark",
  modifyLimiter,
  logActivity("BOOKMARK_PROBLEM_STATEMENT"),
  async (req: AuthRequest, res) => {
    try {
      const { problemStatementId } = req.body;
      const result = await participantService.bookmarkProblemStatement(req.user!.userId, problemStatementId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Get bookmarked problem statements
router.get("/problem-statements/bookmarks", async (req: AuthRequest, res) => {
  try {
    const bookmarks = await participantService.getBookmarkedProblemStatements(req.user!.userId);
    res.json(bookmarks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Submit project
router.post("/submissions", modifyLimiter, logActivity("SUBMIT_PROJECT"), async (req: AuthRequest, res) => {
  try {
    const submission = await participantService.submitProject(req.user!.userId, req.body);
    res.status(201).json(submission);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get team submissions
router.get("/submissions", async (req: AuthRequest, res) => {
  try {
    const submissions = await participantService.getTeamSubmissions(req.user!.userId);
    res.json(submissions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get available mentors
router.get("/mentors", async (req, res) => {
  try {
    const mentors = await participantService.getAvailableMentors();
    res.json(mentors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Book mentorship session
router.post("/mentors/book", modifyLimiter, logActivity("BOOK_MENTORSHIP"), async (req: AuthRequest, res) => {
  try {
    const session = await participantService.bookMentorshipSession(req.user!.userId, req.body);
    res.status(201).json(session);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel mentorship session
router.post(
  "/mentors/cancel/:queueItemId",
  modifyLimiter,
  logActivity("CANCEL_MENTORSHIP"),
  async (req: AuthRequest, res) => {
    try {
      const session = await participantService.cancelMentorshipSession(req.user!.userId, req.params.queueItemId);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Update team checkpoint
router.post(
  "/team/checkpoint/:checkpoint",
  modifyLimiter,
  logActivity("UPDATE_CHECKPOINT"),
  async (req: AuthRequest, res) => {
    try {
      const checkpoint = Number.parseInt(req.params.checkpoint);
      const result = await participantService.updateTeamCheckpoint(req.user!.userId, checkpoint, req.body);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Get team checkpoints
router.get("/team/checkpoints", async (req: AuthRequest, res) => {
  try {
    const checkpoints = await participantService.getTeamCheckpoints(req.user!.userId);
    res.json(checkpoints);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get announcements
router.get("/announcements", async (req, res) => {
  try {
    const announcements = await participantService.getAnnouncements();
    res.json(announcements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get system settings
router.get("/settings", async (req, res) => {
  try {
    const settings = await participantService.getSystemSettings();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
