import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/password";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

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

function normalizeTeamName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
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
      name: "Judge One",
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
      name: "Mentor One",
      expertise: ["React", "Node.js", "Python"],
      meetLink: "https://meet.google.com/sample-link",
    },
  });

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
      title: "Welcome to MUJ HackX 3.0!",
      message:
        "Welcome to MUJ HackX 3.0! Please select your problem statements and start building amazing solutions. Good luck to all teams!",
      authorId: superAdmin.id,
    },
  });

  console.log("✅ Created sample announcement");

  return { superAdmin, admin };
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

async function importShortlistedTeams() {
  console.log("📊 Importing shortlisted teams with lenient validation...");

  // Read shortlisted teams
  const shortlistedPath = path.join(__dirname, '../data/shortlisted-teams.csv');
  const extendedPath = path.join(__dirname, '../data/extended-registration.csv');
  
  if (!fs.existsSync(shortlistedPath)) {
    throw new Error(`Shortlisted teams CSV file not found at ${shortlistedPath}`);
  }
  
  if (!fs.existsSync(extendedPath)) {
    throw new Error(`Extended registration CSV file not found at ${extendedPath}`);
  }

  const shortlistedContent = fs.readFileSync(shortlistedPath, 'utf-8');
  const extendedContent = fs.readFileSync(extendedPath, 'utf-8');
  
  const shortlistedTeams = parseCSV(shortlistedContent) as ShortlistedTeam[];
  const extendedRegistrations = parseCSV(extendedContent) as ExtendedRegistrationRow[];

  console.log(`Found ${shortlistedTeams.length} shortlisted teams`);
  console.log(`Found ${extendedRegistrations.length} extended registrations`);

  // Create a map of shortlisted team names (normalized)
  const shortlistedMap = new Map<string, ShortlistedTeam>();
  shortlistedTeams.forEach(team => {
    const normalizedName = normalizeTeamName(team["Team Name"]);
    shortlistedMap.set(normalizedName, team);
  });

  console.log(`Shortlisted teams: ${Array.from(shortlistedMap.keys()).join(', ')}`);

  let teamCounter = 1;
  let importedCount = 0;
  let notFoundCount = 0;
  let partialDataCount = 0;

  for (const extendedTeam of extendedRegistrations) {
    const teamName = extendedTeam["Team Name"]?.trim();
    if (!teamName) continue;

    const normalizedExtendedName = normalizeTeamName(teamName);
    
    // Check if this team is in the shortlisted teams
    if (!shortlistedMap.has(normalizedExtendedName)) {
      console.log(`⚠️ Team "${teamName}" not found in shortlisted teams`);
      notFoundCount++;
      continue;
    }

    console.log(`✅ Processing shortlisted team: ${teamName}`);

    // Generate team ID
    const teamId = `TEAM${teamCounter.toString().padStart(3, '0')}`;
    
    // Collect team members data with lenient validation
    const members = [];

    // Check if it's MUJ team or external
    const isMUJTeam = extendedTeam["Does all of your team belong to Manipal University Jaipur?"]?.toLowerCase() === "yes";

    if (isMUJTeam) {
      // MUJ team - use MUJ specific fields (the second set of Team Leader fields for MUJ teams)
      // For MUJ teams, use the second occurrence of "Team Leader Name" which is the MUJ-specific one
      const mujLeaderName = extendedTeam["Team Leader Name_2"]?.trim() || extendedTeam["Team Leader Name"]?.trim();
      const mujLeaderEmail = extendedTeam["Team Leader Email (Personal)"]?.trim() || extendedTeam["Team Leader Email (Official)"]?.trim() || '';
      const mujLeaderPhone = extendedTeam["Team Leader Contact Number_2"]?.trim() || extendedTeam["Team Leader Contact Number"]?.trim() || '';
      
      if (isValidMemberName(mujLeaderName)) {
        members.push({
          name: mujLeaderName,
          email: mujLeaderEmail,
          phone: mujLeaderPhone,
          role: "LEADER" as const,
          gender: extendedTeam["Team Leader Gender"]?.trim() || '',
          registrationNumber: extendedTeam["Team Leader Registration Number"]?.trim() || '',
          department: extendedTeam["Team Leader Department"]?.trim() || '',
          yearOfStudy: extendedTeam["Team Leader Year of Study"]?.trim() || '',
          college: 'Manipal University Jaipur'
        });
      }

      // Add ALL MUJ members with their actual names
      for (let i = 2; i <= 4; i++) {
        const memberName = extendedTeam[`Member ${i} Name`]?.trim();
        const memberEmail = extendedTeam[`Member ${i} Email (Personal)`]?.trim() || extendedTeam[`Member ${i} Email (Official)`]?.trim() || '';
        const memberPhone = extendedTeam[`Member ${i} Contact Number`]?.trim() || '';
        
        // Check if we have ANY meaningful data for this member
        if (memberName || memberEmail || memberPhone) {
          // Use actual name if available, otherwise use placeholder
          const finalName = isValidMemberName(memberName) ? memberName : `Member ${i}`;
            
          members.push({
            name: finalName,
            email: memberEmail,
            phone: memberPhone,
            role: "MEMBER" as const,
            gender: extendedTeam[`Member ${i} Gender`]?.trim() || '',
            registrationNumber: extendedTeam[`Member ${i} Registration Number`]?.trim() || '',
            department: extendedTeam[`Member ${i} Department`]?.trim() || '',
            yearOfStudy: extendedTeam[`Member ${i} Year of Study`]?.trim() || '',
            college: 'Manipal University Jaipur'
          });
        }
      }
    } else {
      // External team - use external college fields (the last set of columns for external teams)
      // For external teams, the external leader info is in the 3rd set of "Team Leader Name" columns
      const externalLeaderName = extendedTeam["Team Leader Name_3"]?.trim() || extendedTeam["Team Leader Name"]?.trim(); 
      const leaderCollegeName = extendedTeam["Team Leader College Name"]?.trim();
      const externalLeaderEmail = extendedTeam["Team Leader Email (Personal)_2"]?.trim() || extendedTeam["Team Leader Email (College official email)"]?.trim() || '';
      const externalLeaderPhone = extendedTeam["Team Leader Contact Number_3"]?.trim() || extendedTeam["Team Leader Contact Number"]?.trim() || '';
      
      if (externalLeaderName || externalLeaderEmail || externalLeaderPhone || leaderCollegeName) {
        const finalLeaderName = isValidMemberName(externalLeaderName) ? externalLeaderName : 'Team Leader';
        
        members.push({
          name: finalLeaderName,
          email: externalLeaderEmail,
          phone: externalLeaderPhone,
          role: "LEADER" as const,
          gender: extendedTeam["Team Leader Gender_2"]?.trim() || extendedTeam["Team Leader Gender"]?.trim() || '',
          registrationNumber: extendedTeam["Team Leader College Registration Number"]?.trim() || '',
          department: extendedTeam["Team Leader Degree Specialization"]?.trim() || extendedTeam["Team Leader Department"]?.trim() || '',
          yearOfStudy: extendedTeam["Team Leader Year of Study_2"]?.trim() || extendedTeam["Team Leader Year of Study"]?.trim() || '',
          college: leaderCollegeName || 'External College'
        });
      }

      // Add ALL external members with their actual names
      for (let i = 2; i <= 4; i++) {
        const memberName = extendedTeam[`Member ${i} Name`]?.trim() || '';
        const memberEmail = extendedTeam[`Member ${i} Email (Personal)`]?.trim() || extendedTeam[`Member ${i} Email (College official email)`]?.trim() || '';
        const memberPhone = extendedTeam[`Member ${i} Contact Number`]?.trim() || '';
        const memberCollegeName = extendedTeam[`Member ${i} College Name`]?.trim() || '';
        const memberGender = extendedTeam[`Member ${i} Gender`]?.trim() || '';
        const memberRegNo = extendedTeam[`Member ${i} Registration Number`]?.trim() || extendedTeam[`Member ${i} College Registration Number`]?.trim() || '';
        const memberDept = extendedTeam[`Member ${i} Department`]?.trim() || extendedTeam[`Member ${i} Degree Specialization`]?.trim() || '';
        const memberYear = extendedTeam[`Member ${i} Year of Study`]?.trim() || '';
        
        // Import member if ANY data is available
        if (memberName || memberEmail || memberPhone || memberCollegeName || memberGender || memberRegNo || memberDept) {
          // Use actual name if it's valid, otherwise use placeholder
          const finalMemberName = isValidMemberName(memberName) ? memberName : `Member ${i}`;
          
          members.push({
            name: finalMemberName,
            email: memberEmail,
            phone: memberPhone,
            role: "MEMBER" as const,
            gender: memberGender,
            registrationNumber: memberRegNo,
            department: memberDept,
            yearOfStudy: memberYear,
            college: memberCollegeName || leaderCollegeName || 'External College'
          });
        }
      }
    }

    // Even more lenient - if we have at least team name from shortlist, create a minimal entry
    if (members.length === 0) {
      const shortlistedData = shortlistedMap.get(normalizedExtendedName);
      if (shortlistedData) {
        members.push({
          name: shortlistedData["Team Leader Name"]?.trim() || 'Team Leader',
          email: shortlistedData["Team Leader's Official mail ID"]?.trim() || '',
          phone: shortlistedData["Team Leader's Contact No."]?.trim() || '',
          role: "LEADER" as const,
          gender: '',
          registrationNumber: '',
          department: '',
          yearOfStudy: '',
          college: 'Unknown'
        });
        console.log(`📝 Created minimal entry from shortlist data for: ${teamName}`);
        partialDataCount++;
      }
    }

    if (members.length === 0) {
      console.log(`❌ Skipping team ${teamName} - absolutely no valid data found`);
      continue;
    }

    try {
      // Create team
      const team = await prisma.team.create({
        data: {
          name: teamName,
          teamId: teamId,
          password: "team123", // Default password
          status: "REGISTERED",
        },
      });

      // Create team participants
      for (const member of members) {
        if (member.name && member.name.trim() !== '' && member.name.trim().length > 0) {
          await prisma.teamParticipant.create({
            data: {
              teamId: team.id,
              name: member.name.trim(),
              email: member.email || '',
              phone: member.phone || '',
              role: member.role,
              verified: false,
            },
          });
        }
      }

      console.log(`✅ Created shortlisted team: ${teamName} (${teamId}) with ${members.length} members (MUJ: ${isMUJTeam}):`);
      members.forEach((member, index) => {
        console.log(`   ${index + 1}. ${member.name} | ${member.email} | ${member.phone} | ${member.role}`);
      });
      teamCounter++;
      importedCount++;

    } catch (error) {
      console.error(`❌ Error creating team ${teamName}:`, error);
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`✅ Successfully imported: ${importedCount} shortlisted teams`);
  console.log(`📝 Teams with partial data: ${partialDataCount}`);
  console.log(`⚠️ Teams not in shortlist: ${notFoundCount}`);
  console.log(`📋 Total shortlisted teams: ${shortlistedTeams.length}`);
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