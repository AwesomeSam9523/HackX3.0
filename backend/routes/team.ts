import { Router } from "express";
import { teamService } from "../services/teamService";
import { requireParticipant } from "../middleware/auth";
import { modifyLimiter } from "../middleware/rateLimiter";
import { logActivity } from "../middleware/logging";
import type { AuthRequest } from "../middleware/auth";

const router = Router();

// Apply participant authentication to all routes
router.use(requireParticipant);

// Get team information
router.get("/team", async (req: AuthRequest, res, next) => {
  try {
    const team = await teamService.getTeamInfo(req.user!.id);
    res.json(team);
  } catch (error: any) {
    next(error)
  }
});

// Get domains with problem statements
router.get("/domains", async (req: AuthRequest, res, next) => {
  try {
    const domains = await teamService.getDomains();
    res.json(domains);
  } catch (error: any) {
    next(error)
  }
});

// Get all problem statements
router.get("/problem-statements", async (req: AuthRequest, res, next) => {
  try {
    const problemStatements = await teamService.getProblemStatements();
    res.json(problemStatements);
  } catch (error: any) {
    next(error)
  }
});

// Select problem statement
router.post(
  "/problem-statements/select",
  modifyLimiter,
  logActivity("SELECT_PROBLEM_STATEMENT"),
  async (req: AuthRequest, res, next) => {
    try {
      const { problemStatementId } = req.body;
      const team = await teamService.selectProblemStatement(req.user!.id, problemStatementId);
      res.json(team);
    } catch (error: any) {
      next(error)
    }
  },
);

// Bookmark problem statement
router.post(
  "/problem-statements/bookmark",
  modifyLimiter,
  logActivity("BOOKMARK_PROBLEM_STATEMENT"),
  async (req: AuthRequest, res, next) => {
    try {
      const { problemStatementId } = req.body;
      const result = await teamService.bookmarkProblemStatement(req.user!.id, problemStatementId);
      res.json(result);
    } catch (error: any) {
      next(error)
    }
  },
);

// Get bookmarked problem statements
router.get("/problem-statements/bookmarks", async (req: AuthRequest, res, next) => {
  try {
    const bookmarks = await teamService.getBookmarkedProblemStatements(req.user!.id);
    res.json(bookmarks);
  } catch (error: any) {
    next(error)
  }
});

// Submit project
router.post("/submissions", modifyLimiter, logActivity("SUBMIT_PROJECT"), async (req: AuthRequest, res, next) => {
  try {
    const submission = await teamService.submitProject(req.user!.id, req.body);
    res.status(201).json(submission);
  } catch (error: any) {
    next(error)
  }
});

// Get team submissions
router.get("/submissions", async (req: AuthRequest, res, next) => {
  try {
    const submissions = await teamService.getTeamSubmissions(req.user!.id);
    res.json(submissions);
  } catch (error: any) {
    next(error)
  }
});

// Get available mentors
router.get("/mentors", async (req: AuthRequest, res, next) => {
  try {
    const mentors = await teamService.getAvailableMentors();
    res.json(mentors);
  } catch (error: any) {
    next(error)
  }
});

// Book mentorship session
router.post("/mentors/book", modifyLimiter, logActivity("BOOK_MENTORSHIP"), async (req: AuthRequest, res, next) => {
  try {
    const session = await teamService.bookMentorshipSession(req.user!.id, req.body);
    res.status(201).json(session);
  } catch (error: any) {
    next(error)
  }
});

// Cancel mentorship session
router.post(
  "/mentors/cancel",
  modifyLimiter,
  logActivity("CANCEL_MENTORSHIP"),
  async (req: AuthRequest, res, next) => {
    try {
      const session = await teamService.cancelMentorshipSession(req.user!.id, req.body.queueId);
      res.json(session);
    } catch (error: any) {
      next(error)
    }
  },
);

// Get announcements
router.get("/announcements", async (req: AuthRequest, res, next) => {
  try {
    const announcements = await teamService.getAnnouncements();
    res.json(announcements);
  } catch (error: any) {
    next(error)
  }
});

export default router;
