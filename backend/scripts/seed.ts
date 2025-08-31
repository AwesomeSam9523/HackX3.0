import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/password";

const prisma = new PrismaClient();

async function rooms() {
  const data: { name: string; capacity: number }[] = [];
  const floors = [0, 1, 2, 3];

  floors.forEach(floor => {
    for (let room = 1; room <= 30; room++) {
      const roomNumber = `${floor}${room.toString().padStart(2, '0')}`;
      const capacity = Math.random() < 0.5 ? 5 : 6;

      data.push({
        name: roomNumber,
        capacity: capacity
      });
    }
  });

  await prisma.round1Room.createMany({
    data,
    skipDuplicates: true,
  });

  console.log("✅ Created round 1 rooms");
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Create domains
  const domains = await Promise.all([
    prisma.domain.upsert({
      where: { name: "Web Development" },
      update: {},
      create: {
        name: "Web Development",
        description: "Frontend and backend web applications",
      },
    }),
    prisma.domain.upsert({
      where: { name: "Mobile Development" },
      update: {},
      create: {
        name: "Mobile Development",
        description: "iOS and Android mobile applications",
      },
    }),
    prisma.domain.upsert({
      where: { name: "AI/ML" },
      update: {},
      create: {
        name: "AI/ML",
        description: "Artificial Intelligence and Machine Learning solutions",
      },
    }),
    prisma.domain.upsert({
      where: { name: "Blockchain" },
      update: {},
      create: {
        name: "Blockchain",
        description: "Decentralized applications and blockchain solutions",
      },
    }),
    prisma.domain.upsert({
      where: { name: "IoT" },
      update: {},
      create: {
        name: "IoT",
        description: "Internet of Things and embedded systems",
      },
    }),
  ]);

  console.log("✅ Created domains");

  // Create problem statements
  const problemStatements = await Promise.all([
    prisma.problemStatement.upsert({
      where: { id: "ps1" },
      update: {},
      create: {
        id: "ps1",
        title: "E-commerce Platform for Local Businesses",
        description:
          "Build a comprehensive e-commerce platform that helps local businesses establish their online presence with features like inventory management, order processing, and customer analytics.",
        domainId: domains[0].id,
      },
    }),
    prisma.problemStatement.upsert({
      where: { id: "ps2" },
      update: {},
      create: {
        id: "ps2",
        title: "Mental Health Support Mobile App",
        description:
          "Develop a mobile application that provides mental health resources, mood tracking, and connects users with professional counselors through secure messaging and video calls.",
        domainId: domains[1].id,
      },
    }),
    prisma.problemStatement.upsert({
      where: { id: "ps3" },
      update: {},
      create: {
        id: "ps3",
        title: "AI-Powered Learning Assistant",
        description:
          "Create an AI-powered educational platform that personalizes learning experiences, provides intelligent tutoring, and adapts to individual student learning patterns.",
        domainId: domains[2].id,
      },
    }),
  ]);

  console.log("✅ Created problem statements");

  // Create super admin user
  const superAdminPassword = await hashPassword("admin123");
  const superAdmin = await prisma.user.upsert({
    where: { username: "superadmin" },
    update: {},
    create: {
      username: "superadmin",
      password: superAdminPassword,
      email: "superadmin@hackathon.com",
      role: "SUPER_ADMIN",
    },
  });

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      email: "admin@hackathon.com",
      role: "ADMIN",
    },
  });

  // Create sample judge
  const judgePassword = await hashPassword("judge123");
  const judgeUser = await prisma.user.upsert({
    where: { username: "judge1" },
    update: {},
    create: {
      username: "judge1",
      password: judgePassword,
      email: "judge1@hackathon.com",
      role: "JUDGE",
    },
  });

  const judge = await prisma.judge.upsert({
    where: { userId: judgeUser.id },
    update: {},
    create: {
      userId: judgeUser.id,
      expertise: ["Web Development", "Mobile Development"],
    },
  });

  // Create sample mentor
  const mentorPassword = await hashPassword("mentor123");
  const mentorUser = await prisma.user.upsert({
    where: { username: "mentor1" },
    update: {},
    create: {
      username: "mentor1",
      password: mentorPassword,
      email: "mentor1@hackathon.com",
      role: "MENTOR",
    },
  });

  const mentor = await prisma.mentor.upsert({
    where: { userId: mentorUser.id },
    update: {},
    create: {
      userId: mentorUser.id,
      expertise: ["React", "Node.js", "Python"],
      meetLink: "https://meet.google.com/sample-link",
    },
  });

  // Create sample team and participants
  const participantPassword = await hashPassword("team123");
  const participant1 = await prisma.user.upsert({
    where: { username: "participant1" },
    update: {},
    create: {
      username: "participant1",
      password: participantPassword,
      email: "participant1@hackathon.com",
      role: "TEAM",
    },
  });

  const participant2 = await prisma.user.upsert({
    where: { username: "participant2" },
    update: {},
    create: {
      username: "participant2",
      password: participantPassword,
      email: "participant2@hackathon.com",
      role: "TEAM",
    },
  });

  const team = await prisma.team.upsert({
    where: { teamId: "TEAM001" },
    update: {},
    create: {
      name: "Code Warriors",
      teamId: "TEAM001",
      password: "team123",
      roomNumber: "R101",
      participants: {
        connect: [{ id: participant1.id }, { id: participant2.id }],
      },
    },
  });

  console.log("✅ Created sample users and team");

  // Create system settings
  await Promise.all([
    prisma.systemSettings.upsert({
      where: { key: "problem_statements_locked" },
      update: {},
      create: {
        key: "problem_statements_locked",
        value: "false",
        description: "Whether problem statement selection is locked",
      },
    }),
    prisma.systemSettings.upsert({
      where: { key: "mentorship_locked" },
      update: {},
      create: {
        key: "mentorship_locked",
        value: "false",
        description: "Whether mentorship booking is locked",
      },
    }),
    prisma.systemSettings.upsert({
      where: { key: "round1_locked" },
      update: {},
      create: {
        key: "round1_locked",
        value: "false",
        description: "Whether round 1 submissions are locked",
      },
    }),
  ]);

  console.log("✅ Created system settings");

  // Create sample announcement
  await prisma.announcement.upsert({
    where: { id: "announcement1" },
    update: {},
    create: {
      id: "announcement1",
      title: "Welcome to the Hackathon!",
      message:
        "Welcome to our hackathon platform! Please select your problem statements and start building amazing solutions. Good luck to all teams!",
      authorId: superAdmin.id,
    },
  });

  console.log("✅ Created sample announcement");

  console.log("🎉 Database seed completed successfully!");
  console.log("\n📋 Sample Credentials:");
  console.log("Super Admin: superadmin / admin123");
  console.log("Admin: admin / admin123");
  console.log("Judge: judge1 / judge123");
  console.log("Mentor: mentor1 / mentor123");
  console.log("Participant: participant1 / team123");
  console.log("Participant: participant2 / team123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

rooms()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
