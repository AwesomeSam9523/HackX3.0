import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export class MentorService {
  // Get mentor profile
  async getMentorProfile(userId: string) {
    const mentor = await prisma.mentor.findUnique({
      where: {userId},
      include: {
        user: {
          select: {id: true, username: true, email: true},
        },
        mentorshipQueue: {
          include: {
            team: {
              include: {
                participants: {
                  select: {id: true, name: true, email: true},
                },
                problemStatement: {
                  include: {domain: true},
                },
              },
            },
          },
          orderBy: {createdAt: "asc"},
        },
      },
    });

    if (!mentor) {
      throw new Error("Mentor profile not found");
    }

    return mentor;
  }

  // Get mentor queue
  async getMentorQueue(userId: string) {
    const mentor = await prisma.mentor.findUnique({
      where: {userId},
    });

    if (!mentor) {
      throw new Error("Mentor profile not found");
    }

    return prisma.mentorshipQueue.findMany({
      where: {
        mentorId: mentor.id,
        status: 'WAITING',
      },
      include: {
        team: {
          include: {
            problemStatement: {
              include: {domain: true},
            },
            round1Room: {
              select: {id: true, block: true, name: true},
            },
          },
        },
      },
      orderBy: {createdAt: "asc"},
    });
  }

  // Update mentor availability
  async updateAvailability(userId: string, isAvailable: boolean) {
    const mentor = await prisma.mentor.findUnique({
      where: {userId},
    });

    if (!mentor) {
      throw new Error("Mentor profile not found");
    }

    return prisma.mentor.update({
      where: {id: mentor.id},
      data: {isAvailable},
    });
  }

  // Update meet link
  async updateMeetLink(userId: string, meetLink: string) {
    const mentor = await prisma.mentor.findUnique({
      where: {userId},
    });

    if (!mentor) {
      throw new Error("Mentor profile not found");
    }

    return prisma.mentor.update({
      where: {id: mentor.id},
      data: {meetLink},
    });
  }

  // Resolve mentorship session
  async resolveMentorshipSession(userId: string, queueItemId: string, notes?: string) {
    const mentor = await prisma.mentor.findUnique({
      where: {userId},
    });

    if (!mentor) {
      throw new Error("Mentor profile not found");
    }

    // Check if the queue item belongs to this mentor
    const queueItem = await prisma.mentorshipQueue.findUnique({
      where: {id: queueItemId},
    });

    if (!queueItem || queueItem.mentorId !== mentor.id) {
      throw new Error("Queue item not found or not assigned to this mentor");
    }

    return prisma.mentorshipQueue.update({
      where: {id: queueItemId},
      data: {
        status: "RESOLVED",
        notes,
      },
    });
  }

  // Start mentorship session
  async startMentorshipSession(userId: string, queueItemId: string) {
    const mentor = await prisma.mentor.findUnique({
      where: {userId},
    });

    if (!mentor) {
      throw new Error("Mentor profile not found");
    }

    const queueItem = await prisma.mentorshipQueue.findUnique({
      where: {id: queueItemId},
    });

    if (!queueItem || queueItem.mentorId !== mentor.id) {
      throw new Error("Queue item not found or not assigned to this mentor");
    }

    // return prisma.mentorshipQueue.update({
    //   where: { id: queueItemId },
    //   data: { status: "IN_PROGRESS" },
    // });
  }

  // Cancel mentorship session
  async cancelMentorshipSession(userId: string, queueItemId: string, reason?: string) {
    const mentor = await prisma.mentor.findUnique({
      where: {userId},
    });

    if (!mentor) {
      throw new Error("Mentor profile not found");
    }

    const queueItem = await prisma.mentorshipQueue.findUnique({
      where: {id: queueItemId},
    });

    if (!queueItem || queueItem.mentorId !== mentor.id) {
      throw new Error("Queue item not found or not assigned to this mentor");
    }

    return prisma.mentorshipQueue.update({
      where: {id: queueItemId},
      data: {
        status: "CANCELLED",
        notes: reason,
      },
    });
  }

  // Get mentorship history
  async getMentorshipHistory(userId: string) {
    const mentor = await prisma.mentor.findUnique({
      where: {userId},
    });

    if (!mentor) {
      throw new Error("Mentor profile not found");
    }

    const history = await prisma.mentorshipQueue.findMany({
      where: {
        mentorId: mentor.id,
        status: {in: ["RESOLVED", "CANCELLED"]},
      },
      include: {
        team: {
          include: {
            participants: {
              select: {id: true, name: true, email: true},
            },
            problemStatement: {
              include: {domain: true},
            },
          },
        },
      },
      orderBy: {updatedAt: "desc"},
    });

    const stats = await prisma.mentorshipQueue.groupBy({
      by: ["status"],
      where: {mentorId: mentor.id},
      _count: {status: true},
    });

    return {
      history,
      stats: {
        total: history.length,
        resolved: stats.find((s) => s.status === "RESOLVED")?._count.status || 0,
        cancelled: stats.find((s) => s.status === "CANCELLED")?._count.status || 0,
        waiting: stats.find((s) => s.status === "WAITING")?._count.status || 0,
      },
    };
  }

  // Get all mentors (for reference)
  async getAllMentors() {
    return prisma.mentor.findMany({
      include: {
        user: {
          select: {id: true, username: true, email: true},
        },
        _count: {
          select: {mentorshipQueue: true},
        },
      },
      orderBy: {createdAt: "desc"},
    });
  }

  // Get available mentors for booking
  async getAvailableMentors() {
    return prisma.mentor.findMany({
      where: {isAvailable: true},
      include: {
        user: {
          select: {id: true, username: true, email: true},
        },
        _count: {
          select: {
            mentorshipQueue: {
              where: {status: "WAITING"},
            },
          },
        },
      },
      orderBy: [
        {
          mentorshipQueue: {
            _count: "asc",
          },
        },
        {createdAt: "desc"},
      ],
    });
  }

  // Book mentorship session (called by participants)
  async bookMentorshipSession(teamId: string, mentorId: string, query?: string) {
    // Check if mentor exists and is available
    const mentor = await prisma.mentor.findUnique({
      where: {id: mentorId},
    });

    if (!mentor) {
      throw new Error("Mentor not found");
    }

    if (!mentor.isAvailable) {
      throw new Error("Mentor is not available");
    }

    // Check if team already has a pending session with this mentor
    const existingSession = await prisma.mentorshipQueue.findFirst({
      where: {
        teamId,
        mentorId,
        status: "WAITING",
      },
    });

    if (existingSession) {
      throw new Error("Team already has a pending session with this mentor");
    }

    // Create mentorship queue item
    return prisma.mentorshipQueue.create({
      data: {
        teamId,
        mentorId,
        query,
        status: "WAITING",
      },
      include: {
        team: {
          include: {
            participants: {
              select: {id: true, name: true, email: true},
            },
          },
        },
        mentor: {
          include: {
            user: {
              select: {username: true},
            },
          },
        },
      },
    });
  }

  // Get announcements
  async getAnnouncements() {
    return prisma.announcement.findMany({
      include: {
        author: {
          select: {username: true, role: true},
        },
      },
      orderBy: {createdAt: "desc"},
      take: 50,
    });
  }

  // Update mentor profile
  async updateMentorProfile(
    userId: string,
    data: {
      expertise?: string[]
      meetLink?: string
    },
  ) {
    const mentor = await prisma.mentor.findUnique({
      where: {userId},
    });

    if (!mentor) {
      throw new Error("Mentor profile not found");
    }

    return prisma.mentor.update({
      where: {id: mentor.id},
      data: {
        expertise: data.expertise,
        meetLink: data.meetLink,
      },
    });
  }
}

export const mentorService = new MentorService();
