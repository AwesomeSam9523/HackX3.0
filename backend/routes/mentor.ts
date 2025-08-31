import { Router } from "express";
import { mentorService } from "../services/mentorService";
import { requireMentor } from "../middleware/auth";
import { modifyLimiter } from "../middleware/rateLimiter";
import { logActivity } from "../middleware/logging";
import type { AuthRequest } from "../middleware/auth";

const router = Router();

// Apply mentor authentication to all routes
router.use(requireMentor);

// Get mentor profile
router.get("/profile", async (req: AuthRequest, res, next) => {
  try {
    const profile = await mentorService.getMentorProfile(req.user!.id);
    res.json(profile);
  } catch (error: any) {
    next(error)
  }
});

// Get mentor queue
router.get("/queue", async (req: AuthRequest, res, next) => {
  try {
    const queue = await mentorService.getMentorQueue(req.user!.id);
    res.json(queue);
  } catch (error: any) {
    next(error)
  }
});

// Update availability
router.post(
  "/availability",
  modifyLimiter,
  logActivity("UPDATE_MENTOR_AVAILABILITY"),
  async (req: AuthRequest, res, next) => {
    try {
      const { isAvailable } = req.body;
      const mentor = await mentorService.updateAvailability(req.user!.id, isAvailable);
      res.json(mentor);
    } catch (error: any) {
      next(error)
    }
  },
);

// Update meet link
router.post("/meet-link", modifyLimiter, logActivity("UPDATE_MEET_LINK"), async (req: AuthRequest, res, next) => {
  try {
    const { meetLink } = req.body;
    const mentor = await mentorService.updateMeetLink(req.user!.id, meetLink);
    res.json(mentor);
  } catch (error: any) {
    next(error)
  }
});

// Start mentorship session
router.post(
  "/queue/start",
  modifyLimiter,
  logActivity("START_MENTORSHIP_SESSION"),
  async (req: AuthRequest, res, next) => {
    try {
      const { queueItemId } = req.body;
      const session = await mentorService.startMentorshipSession(req.user!.id, queueItemId);
      res.json(session);
    } catch (error: any) {
      next(error)
    }
  },
);

// Resolve mentorship session
router.post(
  "/queue/resolve",
  modifyLimiter,
  logActivity("RESOLVE_MENTORSHIP_SESSION"),
  async (req: AuthRequest, res, next) => {
    try {
      const { queueItemId, notes } = req.body;
      const session = await mentorService.resolveMentorshipSession(req.user!.id, queueItemId, notes);
      res.json(session);
    } catch (error: any) {
      next(error)
    }
  },
);

// Cancel mentorship session
router.post(
  "/queue/cancel",
  modifyLimiter,
  logActivity("CANCEL_MENTORSHIP_SESSION"),
  async (req: AuthRequest, res, next) => {
    try {
      const { queueItemId, reason } = req.body;
      const session = await mentorService.cancelMentorshipSession(req.user!.id, queueItemId, reason);
      res.json(session);
    } catch (error: any) {
      next(error)
    }
  },
);

// Get mentorship history
router.get("/history", async (req: AuthRequest, res, next) => {
  try {
    const history = await mentorService.getMentorshipHistory(req.user!.id);
    res.json(history);
  } catch (error: any) {
    next(error)
  }
});

// Update mentor profile
router.put("/profile", modifyLimiter, logActivity("UPDATE_MENTOR_PROFILE"), async (req: AuthRequest, res, next) => {
  try {
    const mentor = await mentorService.updateMentorProfile(req.user!.id, req.body);
    res.json(mentor);
  } catch (error: any) {
    next(error)
  }
});

// Get announcements
router.get("/announcements", async (req: AuthRequest, res, next) => {
  try {
    const announcements = await mentorService.getAnnouncements();
    res.json(announcements);
  } catch (error: any) {
    next(error)
  }
});

// Get all mentors (for reference)
router.get("/all", async (req: AuthRequest, res, next) => {
  try {
    const mentors = await mentorService.getAllMentors();
    res.json(mentors);
  } catch (error: any) {
    next(error)
  }
});

// Get available mentors for booking
router.get("/available", async (req: AuthRequest, res, next) => {
  try {
    const mentors = await mentorService.getAvailableMentors();
    res.json(mentors);
  } catch (error: any) {
    next(error)
  }
});

// Book mentorship session (accessible by participants)
router.post("/book", modifyLimiter, logActivity("BOOK_MENTORSHIP_SESSION"), async (req: AuthRequest, res, next) => {
  try {
    const { teamId, mentorId, query } = req.body;
    const session = await mentorService.bookMentorshipSession(teamId, mentorId, query);
    res.status(201).json(session);
  } catch (error: any) {
    next(error)
  }
});

export default router;
