export interface User {
  id: string
  username: string
  role: "participant" | "mentor" | "judge" | "admin" | "super_admin"
  teamId?: string
  status: "Active" | "Disabled"
}

export interface Team {
  id: string
  teamName: string
  problemStatement: string
  roomNumber: string
  checkpoint1: boolean
  checkpoint2: boolean
  checkpoint3: boolean
  credentialsGiven: boolean
  status: string
  wifiOptIn: boolean
  generatedId: string | null
  generatedPassword: string | null
  members: string[]
  round1Status?: string
  round2Status?: string
  round2Room?: string | null
  judgementStatus?: string
  githubLink?: string | null
  presentationLink?: string | null
  submissionStatus?: "submitted" | "partial" | "not_submitted"
}

export interface ProblemStatement {
  id: string
  title: string
  description: string
  deliverables: string[]
  selectedCount: number
  domain: string
}

export interface Domain {
  id: string
  name: string
  problemStatements: ProblemStatement[]
}

export interface Mentor {
  id: string
  name: string
  domain: string
  mode: "Online" | "Offline"
  queueCount: number
  maxCapacity: number
  status: string
}

export interface Judge {
  id: string
  name: string
  floor: string
  teamsCompleted: number
  teamsLeft: number
  status: string
  round: number
}

export interface Announcement {
  id: number
  title: string
  message: string
  time: string
  timestamp: string
}

export interface QueueItem {
  id: string
  teamName: string
  problemStatement: string
  roomNumber: string
  waitTime: string
  status: string
}

export interface ScoringCriteria {
  id: string
  name: string
  weight: number
  maxScore: number
}

export interface ProblemStatementForm {
  title: string
  description: string
  deliverables: string[]
  domain: string
}

export interface TeamJudgeMapping {
  teamId: string
  judgeId: string
  floor: string
  roomNumber: string
}

export interface TeamJudgeMappingType {
  teamId: string
  judgeId: string
  floor: string
  roomNumber?: string
}

export interface TeamScore {
  teamId: string
  teamName: string
  judgeId: string
  judgeName: string
  scores: { [criteriaId: string]: number }
  totalScore: number
  evaluatedAt: string
}

export interface Round2Room {
  id: string
  roomNumber: string
  floor: string
  capacity: number
  assignedJudge?: string
  assignedTeams: string[]
}

export interface LogEntry {
  id: number
  timestamp: string
  action: string
  user: string
  target: string
  details: string
}

export interface LogFilter {
  action?: string
  user?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}
