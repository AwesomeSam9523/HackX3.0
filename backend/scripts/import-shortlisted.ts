import {PrismaClient} from "@prisma/client";
import {hashPassword} from "../utils/password";
import * as fs from "fs";
import * as path from "path";
import {fileURLToPath} from "url";
import {parse} from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

interface ShortlistedTeam {
  "Team Name": string;
  "Team Leader Name": string;
  "Team Leader's Contact No.": string;
  "Team Leader's Official mail ID": string;
  "Number of Team members": string;
}

interface ExtendedRegistrationRow {
  [key: string]: string;

  "Team Name": string;
  "Team Leader Name": string;
  "Team Leader Contact Number": string;
  "Team Leader E-mail": string;
  "Does all of your team belong to Manipal University Jaipur?": string;
}

function parseCSV(content: string): any[] {
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  // Handle duplicate headers by making them unique
  const uniqueHeaders = headers.map((header, index) => {
    const occurrences = headers.slice(0, index).filter(h => h === header).length;
    return occurrences > 0 ? `${header}_${occurrences + 1}` : header;
  });

  const data: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;

    const values: string[] = [];
    let currentValue = '';
    let inQuotes = false;

    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];

      if (char === '"' && !inQuotes) {
        inQuotes = true;
      } else if (char === '"' && inQuotes) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    const row: any = {};
    uniqueHeaders.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    // Also add original headers for backward compatibility
    headers.forEach((header, index) => {
      if (!row[header]) { // Only if not already set by unique header
        row[header] = values[index] || '';
      }
    });

    data.push(row);
  }

  return data;
}

function isValidMemberData(name: string, email: string): boolean {
  const cleanName = name?.trim();
  return Boolean(cleanName && cleanName.length > 1 && cleanName !== '-' && cleanName.toLowerCase() !== 'null' && !cleanName.toLowerCase().startsWith('member '));
}

function isValidMemberName(name: string): boolean {
  const cleanName = name?.trim();
  return Boolean(cleanName && cleanName.length > 1 && cleanName !== '-' && cleanName.toLowerCase() !== 'null' && !cleanName.toLowerCase().startsWith('member '));
}

function hasAnyMemberInfo(extendedTeam: ExtendedRegistrationRow, memberIndex: number): boolean {
  const name = extendedTeam[`Member ${memberIndex} Name`]?.trim();
  const email = extendedTeam[`Member ${memberIndex} Email (Personal)`]?.trim() || extendedTeam[`Member ${memberIndex} Email (Official)`]?.trim();
  const phone = extendedTeam[`Member ${memberIndex} Contact Number`]?.trim();
  const college = extendedTeam[`Member ${memberIndex} College Name`]?.trim();

  return Boolean(name || email || phone || college);
}

async function createBasicData() {
  console.log("🌱 Creating basic system data...");

  // Create domains
  const domains = await Promise.all([
    prisma.domain.upsert({
      where: {name: "Web Development"},
      update: {},
      create: {
        name: "Web Development",
        description: "Frontend and backend web applications",
      },
    }),
    prisma.domain.upsert({
      where: {name: "Mobile Development"},
      update: {},
      create: {
        name: "Mobile Development",
        description: "iOS and Android mobile applications",
      },
    }),
    prisma.domain.upsert({
      where: {name: "AI/ML"},
      update: {},
      create: {
        name: "AI/ML",
        description: "Artificial Intelligence and Machine Learning solutions",
      },
    }),
    prisma.domain.upsert({
      where: {name: "Blockchain"},
      update: {},
      create: {
        name: "Blockchain",
        description: "Decentralized applications and blockchain solutions",
      },
    }),
    prisma.domain.upsert({
      where: {name: "IoT"},
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
      where: {id: "ps1"},
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
      where: {id: "ps2"},
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
      where: {id: "ps3"},
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
    where: {username: "superadmin"},
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
    where: {username: "admin"},
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
    where: {username: "judge1"},
    update: {},
    create: {
      username: "judge1",
      password: judgePassword,
      email: "judge1@hackathon.com",
      role: "JUDGE",
    },
  });

  const judge = await prisma.judge.upsert({
    where: {userId: judgeUser.id},
    update: {},
    create: {
      userId: judgeUser.id,
      name: "Judge One",
    },
  });

  // Create sample mentor
  const mentorPassword = await hashPassword("mentor123");
  const mentorUser = await prisma.user.upsert({
    where: {username: "mentor1"},
    update: {},
    create: {
      username: "mentor1",
      password: mentorPassword,
      email: "mentor1@hackathon.com",
      role: "MENTOR",
    },
  });

  const mentor = await prisma.mentor.upsert({
    where: {userId: mentorUser.id},
    update: {},
    create: {
      userId: mentorUser.id,
      name: "Mentor One",
      expertise: ["React", "Node.js", "Python"],
      meetLink: "https://meet.google.com/sample-link",
    },
  });

  // Create system settings
  await Promise.all([
    prisma.systemSettings.upsert({
      where: {key: "problem_statements_locked"},
      update: {},
      create: {
        key: "problem_statements_locked",
        value: "false",
        description: "Whether problem statement selection is locked",
      },
    }),
    prisma.systemSettings.upsert({
      where: {key: "mentorship_locked"},
      update: {},
      create: {
        key: "mentorship_locked",
        value: "false",
        description: "Whether mentorship booking is locked",
      },
    }),
    prisma.systemSettings.upsert({
      where: {key: "round1_locked"},
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
    where: {id: "announcement1"},
    update: {},
    create: {
      id: "announcement1",
      title: "Welcome to MUJ HackX 3.0!",
      message:
        "Welcome to MUJ HackX 3.0! Please select your problem statements and start building amazing solutions. Good luck to all teams!",
      authorId: superAdmin.id,
    },
  });

  console.log("✅ Created sample announcement");

  return {superAdmin, admin};
}

async function createRooms() {
  console.log("🏢 Creating rooms...");

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

// ---------- Utility helpers ----------
function normalizeTeamName(s?: string) {
  if (!s) return '';
  return s
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\b(the|team|muj|manipal university jaipur)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isValidName(name?: string) {
  return !!name && name.trim().length > 1 && !/^member\s*\d*$/i.test(name);
}

function trimString(v?: string) {
  return typeof v === 'string' ? v.trim() : '';
}

// ---------- Main import ----------
export async function importShortlistedTeams() {
  console.log('📊 Importing shortlisted teams from Excel...');

  const filePath = path.join(__dirname, '../data/extended_shortlisted_teams.csv');
  if (!fs.existsSync(filePath)) throw new Error(`File not found at ${filePath}`);

  const csvContent = fs.readFileSync(filePath, 'utf-8');
  const rows: Record<string, string>[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  console.log(`Found ${rows.length} rows`);

  const normalizedSeen = new Set<string>();
  let createdCount = 0;
  let skippedCount = 0;
  let emptyCount = 0;
  let counter = 1;

  for (const row of rows) {
    const rawName = trimString(row['Team Name']);
    if (!rawName) continue;
    const normalized = normalizeTeamName(rawName);
    if (normalizedSeen.has(normalized)) continue;
    normalizedSeen.add(normalized);

    const existing = await prisma.team.findFirst({
      where: {name: rawName},
      select: {id: true},
    });
    if (existing) {
      console.warn(`⚠️ Skipping existing team: ${rawName}`);
      skippedCount++;
      continue;
    }

    // Identify MUJ vs external
    const isMUJ =
      trimString(row['Does all of your team belong to Manipal University Jaipur?']).toLowerCase() === 'yes';

    const members: any[] = [];

    if (isMUJ) {
      // MUJ leader
      const leaderName =
        trimString(row['Team Leader Name_2']) || trimString(row['Team Leader Name']);
      if (isValidName(leaderName)) {
        members.push({
          name: leaderName,
          email:
            trimString(row['Team Leader Email (Personal)']) ||
            trimString(row['Team Leader Email (Official)']),
          phone:
            trimString(row['Team Leader Contact Number_2']) ||
            trimString(row['Team Leader Contact Number']),
          role: 'LEADER',
          college: 'Manipal University Jaipur',
        });
      }
      // MUJ members
      for (let i = 2; i <= 4; i++) {
        const name = trimString(row[`Member ${i} Name`]);
        const email =
          trimString(row[`Member ${i} Email (Personal)`]) ||
          trimString(row[`Member ${i} Email (Official)`]);
        const phone = trimString(row[`Member ${i} Contact Number`]);
        if (name || email || phone) {
          members.push({
            name: isValidName(name) ? name : `Member ${i}`,
            email,
            phone,
            role: 'MEMBER',
            college: 'Manipal University Jaipur',
          });
        }
      }
    } else {
      // External leader
      const leaderName =
        trimString(row['Team Leader Name_3']) || trimString(row['Team Leader Name']);
      const leaderCollege =
        trimString(row['Team Leader College Name']) || 'External College';
      if (isValidName(leaderName) || leaderCollege) {
        members.push({
          name: isValidName(leaderName) ? leaderName : 'Team Leader',
          email:
            trimString(row['Team Leader Email (Personal)_2']) ||
            trimString(row['Team Leader Email (College official email)']),
          phone:
            trimString(row['Team Leader Contact Number_3']) ||
            trimString(row['Team Leader Contact Number']),
          role: 'LEADER',
          college: leaderCollege,
        });
      }
      // External members
      for (let i = 2; i <= 4; i++) {
        const name = trimString(row[`Member ${i} Name`]);
        const email =
          trimString(row[`Member ${i} Email (Personal)`]) ||
          trimString(row[`Member ${i} Email (College official email)`]);
        const phone = trimString(row[`Member ${i} Contact Number`]);
        const college =
          trimString(row[`Member ${i} College Name`]) || leaderCollege;
        if (name || email || phone) {
          members.push({
            name: isValidName(name) ? name : `Member ${i}`,
            email,
            phone,
            role: 'MEMBER',
            college,
          });
        }
      }
    }

    if (members.length === 0) {
      console.warn(`❌ Skipping ${rawName}: no member data`);
      emptyCount++;
      continue;
    }

    const teamId = `TEAM${counter.toString().padStart(3, '0')}`;

    try {
      await prisma.$transaction(async tx => {
        const team = await tx.team.create({
          data: {
            name: rawName,
            teamId,
            status: 'REGISTERED',
            participants: {
              create: members.map(m => ({
                name: m.name,
                email: m.email || '',
                phone: m.phone || '',
                role: m.role,
                verified: false,
              })),
            },
          },
        });
        console.log(`✅ Created team: ${team.name} (${teamId}) with ${members.length} members`);
      });
      createdCount++;
      counter++;
    } catch (err) {
      console.error(`❌ Error creating team ${rawName}:`, err);
    }
  }

  console.log('\n📋 Import summary');
  console.log(`✅ Teams created: ${createdCount}`);
  console.log(`⚠️ Teams skipped (existing): ${skippedCount}`);
  console.log(`❌ Teams with no data: ${emptyCount}`);
  console.log(`📊 Total processed: ${normalizedSeen.size}`);
}


async function main() {
  console.log("🚀 Starting lenient shortlisted teams import process...");

  try {
    // Clear existing teams and participants
    console.log("🧹 Clearing existing data...");
    await prisma.teamParticipant.deleteMany();
    await prisma.team.deleteMany();

    // Create basic system data
    await createBasicData();

    // Create rooms
    await createRooms();

    // Import shortlisted teams with lenient validation
    await importShortlistedTeams();

    console.log("🎉 Lenient shortlisted teams import completed successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log("Super Admin: superadmin / admin123");
    console.log("Admin: admin / admin123");
    console.log("Judge: judge1 / judge123");
    console.log("Mentor: mentor1 / mentor123");
    console.log("\n📊 Team credentials: Each team has ID format TEAM001, TEAM002, etc. with password 'team123'");

  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error("❌ Import failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });