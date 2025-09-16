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
  type: 'authenticated';
}

export interface WebsocketCheckpoint {
  type: 'checkpoint';
  teamId: string;
  checkpoint: Checkpoint;
}

export interface WebsocketSubscribe {
  type: 'subscribed';
  channel: string;
}

export type WebsocketData = WebsocketAuthenticated | WebsocketCheckpoint | WebsocketSubscribe;

export interface User extends BaseUser {
  teamId?: string;
  status: "ACTIVE" | "DISABLED";
  participantTeam: {
    id: string;
    name: string;
    teamId: string;
  };
}

export interface Team {
  id: string;
  name: string;
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
  members: string[];
  round1Status?: string;
  round2Status?: string;
  round2Room?: string | null;
  judgementStatus?: string;
  githubRepo: string;
  presentationLink: string;
  submissionStatus?: "submitted" | "partial" | "not_submitted";
  checkpoints: Checkpoint[];
  evaluations: {
    id: string;
    status: "PENDING" | "COMPLETED";
    judge: {
      user: BaseUser;
    };
  }[];
  round1Room: {
    id: string;
    name: string;
    block: string;
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
  meetLink: string;
  isAvailable: boolean;
  user: BaseUser;
  mode: "ONLINE" | "IN_PERSON";
  domain: string;
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
  expertise: string[];
  round1RoomId?: string;
  round2RoomId?: string;
  user: {
    username: string;
    role: Role;
  };
  evaluations: {
    id: string;
    teamId: string;
  }[];
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  createdAt: string;
}

export interface QueueItem {
  id: string;
  teamName: string;
  problemStatement: string;
  roomNumber: string;
  waitTime: string;
  status: string;
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
  judgeId: string;
  floor: string;
  roomNumber: string;
}

export interface TeamJudgeMappingType {
  teamId: string;
  judgeId: string;
  floor: string;
  roomNumber?: string;
}

export interface TeamScore {
  teamId: string;
  name: string;
  judgeId: string;
  judgeName: string;
  teamScores: {
    totalScore: string;
    round: number;
    createdAt: string;
  };
  evaluations: {
    status: string;
  };
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
