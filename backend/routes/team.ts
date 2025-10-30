import {Router} from "express";
import {teamService} from "../services/teamService";
import type {AuthRequest} from "../middleware/auth";
import {requireTeam} from "../middleware/auth";
import {modifyLimiter} from "../middleware/rateLimiter";
import {logActivity} from "../middleware/logging";

const router = Router();

// Apply participant authentication to all routes
router.use(requireTeam);

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

router.get("/problem-statements/selected", async (req: AuthRequest, res, next) => {
  try {
    const selectedPs = await teamService.getSelectedProblemStatement(req.user!.id);
    res.json(selectedPs);
  } catch (error: any) {
    next(error);
  }
});

router.get("/locked", async (req: AuthRequest, res, next) => {
  try {
    const data = await teamService.getLockedOverview()
    res.json(data);
  } catch (error: any) {
    next(error);
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
router.post("/mentors/book", logActivity("BOOK_MENTORSHIP"), async (req: AuthRequest, res, next) => {
  try {
    const session = await teamService.bookMentorshipSession(req.user!.id, req.body);
    res.status(201).json(session);
  } catch (error: any) {
    next(error)
  }
});

router.get("/mentors/selected", async (req: AuthRequest, res, next) => {
  try {
    const session = await teamService.getSelectedMentor(req.user!.id);
    res.status(200).json(session);
  } catch (error: any) {
    next(error);
  }
})

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

router.get("/mentorship-status-allowed", async (req: AuthRequest, res, next) => {
  try {
    const status = await teamService.getTeamPreviousMentorshipStatus(req.user!.id);
    res.json(status);
  } catch (error: any) {
    next(error);
  }
});


export default router;
