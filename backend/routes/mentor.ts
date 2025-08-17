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
router.get("/profile", async (req: AuthRequest, res) => {
  try {
    const profile = await mentorService.getMentorProfile(req.user!.userId);
    res.json(profile);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Get mentor queue
router.get("/queue", async (req: AuthRequest, res) => {
  try {
    const queue = await mentorService.getMentorQueue(req.user!.userId);
    res.json(queue);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update availability
router.post(
  "/availability",
  modifyLimiter,
  logActivity("UPDATE_MENTOR_AVAILABILITY"),
  async (req: AuthRequest, res) => {
    try {
      const { isAvailable } = req.body;
      const mentor = await mentorService.updateAvailability(req.user!.userId, isAvailable);
      res.json(mentor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Update meet link
router.post("/meet-link", modifyLimiter, logActivity("UPDATE_MEET_LINK"), async (req: AuthRequest, res) => {
  try {
    const { meetLink } = req.body;
    const mentor = await mentorService.updateMeetLink(req.user!.userId, meetLink);
    res.json(mentor);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Start mentorship session
router.post(
  "/queue/:queueItemId/start",
  modifyLimiter,
  logActivity("START_MENTORSHIP_SESSION"),
  async (req: AuthRequest, res) => {
    try {
      const session = await mentorService.startMentorshipSession(req.user!.userId, req.params.queueItemId);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Resolve mentorship session
router.post(
  "/queue/:queueItemId/resolve",
  modifyLimiter,
  logActivity("RESOLVE_MENTORSHIP_SESSION"),
  async (req: AuthRequest, res) => {
    try {
      const { notes } = req.body;
      const session = await mentorService.resolveMentorshipSession(req.user!.userId, req.params.queueItemId, notes);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Cancel mentorship session
router.post(
  "/queue/:queueItemId/cancel",
  modifyLimiter,
  logActivity("CANCEL_MENTORSHIP_SESSION"),
  async (req: AuthRequest, res) => {
    try {
      const { reason } = req.body;
      const session = await mentorService.cancelMentorshipSession(req.user!.userId, req.params.queueItemId, reason);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
);

// Get mentorship history
router.get("/history", async (req: AuthRequest, res) => {
  try {
    const history = await mentorService.getMentorshipHistory(req.user!.userId);
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update mentor profile
router.put("/profile", modifyLimiter, logActivity("UPDATE_MENTOR_PROFILE"), async (req: AuthRequest, res) => {
  try {
    const mentor = await mentorService.updateMentorProfile(req.user!.userId, req.body);
    res.json(mentor);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get announcements
router.get("/announcements", async (req, res) => {
  try {
    const announcements = await mentorService.getAnnouncements();
    res.json(announcements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all mentors (for reference)
router.get("/all", async (req, res) => {
  try {
    const mentors = await mentorService.getAllMentors();
    res.json(mentors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get available mentors for booking
router.get("/available", async (req, res) => {
  try {
    const mentors = await mentorService.getAvailableMentors();
    res.json(mentors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Book mentorship session (accessible by participants)
router.post("/book", modifyLimiter, logActivity("BOOK_MENTORSHIP_SESSION"), async (req, res) => {
  try {
    const { teamId, mentorId, query } = req.body;
    const session = await mentorService.bookMentorshipSession(teamId, mentorId, query);
    res.status(201).json(session);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
