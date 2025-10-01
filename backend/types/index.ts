export interface JWTPayload {
  id: string
  username: string
  role: string
}

export interface AuthRequest extends Request {
  user?: JWTPayload
}

export interface LoginRequest {
  username: string
  password: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface CreateUserRequest {
  username: string
  password: string
  email?: string
  role: string
}

export interface TeamScoreRequest {
  teamId: string
  scores: {
    innovation: number
    technical: number
    presentation: number
    impact: number
    feasibility: number
    feedback?: string
  }
}

export interface AnnouncementRequest {
  title: string
  message: string
}

export interface ProblemStatementRequest {
  title: string
  description: string
  domainId: string
}

export interface MentorBookingRequest {
  mentorId: string
  query?: string
}

export interface TeamJudgeMappingRequest {
  teamId: string
  judgeId: string
}

export interface BulkTeamAssignmentRequest {
  teamIds: string[]
  judgeId: string
}

export interface SubmissionRequest {
  githubLink?: string
  pptLink?: string
}

export interface LogFilter {
  action?: string
  userId?: string
  startDate?: string
  endDate?: string
}
