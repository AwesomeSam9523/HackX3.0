type Role = "TEAM" | "MENTOR" | "JUDGE" | "ADMIN" | "SUPER_ADMIN";

export interface BaseUser {
  id: string;
  username: string;
  role: Role;
}

export interface Checkpoint {
  checkpoint: number;
  status: string;
  completedAt: string;
  data?: Record<string, unknown>;
}

export interface Participant {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: "MEMBER" | "LEADER";
  isPresent?: boolean;
  verified?: boolean;
}

export interface TeamCheckpoint1Data {
  id: string;
  name: string;
  teamId: string;
  participants: Participant[];
  wifi: boolean;
  status: string;
}

export interface Checkpoint1UpdateData {
  teamId: string;
  wifi: boolean;
  participants: Participant[];
}

export interface Checkpoint2Data {
  username: string;
  password: string;
  round1Room: {
    id: string;
    name: string;
    block: string;
    capacity: number;
  };
  checkpoint: Checkpoint;
}

export interface WebsocketAuthenticated {
  type: "authenticated";
}

export interface WebsocketCheckpoint {
  type: "checkpoint";
  teamId: string;
  checkpoint: Checkpoint;
}

export interface WebsocketSubscribe {
  type: "subscribed";
  channel: string;
}

export type WebsocketData =
  | WebsocketAuthenticated
  | WebsocketCheckpoint
  | WebsocketSubscribe;

export interface User extends BaseUser {
  teamId?: string;
  status: "ACTIVE" | "DISABLED";
  participantTeam: {
    id: string;
    name: string;
    teamId: string;
  };
  judgeProfile: {
    id: string;
    userId: string;
    name: string;
  };
}

export interface TeamParticipant {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "MEMBER" | "LEADER";
  verified: boolean;
}

export interface Team {
  id: string;
  name: string;
  teamId: string;
  problemStatement: {
    id: string;
    title: string;
    domain: string;
  };
  credentialsGiven: boolean;
  status: string;
  wifiOptIn: boolean;
  generatedId: string | null;
  generatedPassword: string | null;
  participants: TeamParticipant[];
  round1Status?: string;
  round2Status?: string;
  round2Room?: string | null;
  judgementStatus?: string;
  githubRepo: string;
  presentationLink: string;
  submissionStatus: "SUBMITTED" | "NOT_SUBMITTED";
  checkpoints: Checkpoint[];
  evaluations: {
    id: string;
    createdAt: string;
    updatedAt: string;
    status: "PENDING" | "COMPLETED";
    judge: Judge;
  }[];
  round1Room: {
    id: string;
    name: string;
    block: string;
  };
  teamScores: {
    innovation: number;
    impact: number;
    feasibility: number;
    presentation: number;
    technical: number;
    feedback: string;
    totalScore: string;
    round: number;
    createdAt: string;
    updatedAt: string;
    judge: Judge;
  }[];
}

export interface Evaluation {
  evaluationId: string;
  evaluationStatus: "PENDING" | "COMPLETED";
  evaluated: boolean;
  round: number;
  team: Team & {
    hasScore: boolean;
    latestScore: {
      id: string;
      totalScore: number;
      round: number;
      createdAt: string;
    };
    submissionStatus: "SUBMITTED" | "NOT_SUBMITTED";
    problemStatement: ProblemStatement;
    latestSubmission: {
      githubRepo: string;
      presentationLink: string;
      submittedAt: string;
    };
  };
}

export interface ProblemStatement {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  selectedCount: number;
  domain: {
    id: string;
    name: string;
  };
  _count: {
    teams: number;
  };
}

export interface Domain {
  id: string;
  name: string;
  problemStatements: ProblemStatement[];
}

export interface Mentor {
  queueCount: number;
  id: string;
  name: string;
  meetLink: string;
  isAvailable: boolean;
  user: BaseUser;
  mode: "ONLINE" | "IN_PERSON";
  domains: string[];
  expertise: string[];
  mentorshipQueue: {
    id: string;
    teamId: string;
    mentorId: string;
    status: "WAITING" | "RESOLVED" | "CANCELLED";
    query: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    team: {
      name: string;
    };
  }[];
  waitingTeamsCount: number;
}

export interface MentorshipSession {
  id: string;
  teamId: string;
  status: "WAITING" | "CANCELLED" | "RESOLVED";
  query: string;
  mentor: Mentor;
}

export interface Judge {
  id: string;
  userId: string;
  name: string;
  expertise: string[];
  round1RoomId?: string;
  round2RoomId?: string;
  user: BaseUser;
  evaluations: {
    id: string;
    teamId: string;
  }[];
  teamsLeft: number;
  teamsCompleted: number;
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  createdAt: string;
}

export interface QueueItem {
  id: string;
  teamId: string;
  status: "CANCELLED" | "RESOLVED" | "WAITING";
  query: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  team: Team;
}

export interface ScoringCriteria {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
}

export interface ProblemStatementForm {
  title: string;
  description: string;
  deliverables: { id: string; value: string }[];
  domainId: string;
  domain: string;
}

export interface TeamJudgeMapping {
  teamId: string;
  judge: Judge;
  team: {
    id: string;
    name: string;
    teamId: string;
  };
}

export interface TeamScore {
  id: string;
  teamId: string;
  name: string;
  judgeId: string;
  judgeName: string;
  teamScores: {
    innovation: number;
    impact: number;
    feasibility: number;
    presentation: number;
    technical: number;
    feedback: string;
    totalScore: string;
    round: number;
    createdAt: string;
    judge: Judge;
  }[];
  evaluations: {
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Round2Room {
  id: string;
  roomNumber: string;
  floor: string;
  capacity: number;
  assignedJudge?: string;
  assignedTeams: string[];
}

export interface LogEntry {
  id: number;
  action: string;
  user: BaseUser;
  createdAt: string;
  payload: string;
  details: string;
}

export interface LogFilter {
  action?: string;
  user?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface Submission {
  id: string;
  githubRepo: string;
  presentationLink: string;
  submittedAt: string;
}

export interface Scores {
  innovation: number;
  impact: number;
  feasibility: number;
  presentation: number;
  technical: number;
  feedback: string;
}
