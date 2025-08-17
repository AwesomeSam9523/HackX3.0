"use client"

import { authService } from "./auth"
import type {
  User,
  Team,
  Domain,
  Mentor,
  Judge,
  Announcement,
  QueueItem,
  LogEntry,
  TeamScore,
  ProblemStatement,
  ProblemStatementForm,
  TeamJudgeMapping,
  Round2Room,
  LogFilter,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = authService.getToken()

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (response.status === 401) {
      authService.logout()
      throw new Error("Unauthorized")
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Authentication
  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return this.request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  async resetPassword(userId: string): Promise<void> {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ userId }),
    })
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    return this.request("/teams")
  }

  async getTeam(id: string): Promise<Team> {
    return this.request(`/teams/${id}`)
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team> {
    return this.request(`/teams/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async updateCheckpoint(teamId: string, checkpoint: number, data: any): Promise<void> {
    return this.request(`/teams/${teamId}/checkpoint/${checkpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Problem Statements
  async getDomains(): Promise<Domain[]> {
    return this.request("/domains")
  }

  async selectProblemStatement(psId: string): Promise<void> {
    return this.request("/problem-statements/select", {
      method: "POST",
      body: JSON.stringify({ problemStatementId: psId }),
    })
  }

  async bookmarkProblemStatement(psId: string): Promise<void> {
    return this.request("/problem-statements/bookmark", {
      method: "POST",
      body: JSON.stringify({ problemStatementId: psId }),
    })
  }

  async getBookmarkedPS(): Promise<string[]> {
    return this.request("/problem-statements/bookmarks")
  }

  // Problem Statements Management
  async createProblemStatement(data: ProblemStatementForm): Promise<ProblemStatement> {
    return this.request("/admin/problem-statements", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateProblemStatement(id: string, data: Partial<ProblemStatementForm>): Promise<ProblemStatement> {
    return this.request(`/admin/problem-statements/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteProblemStatement(id: string): Promise<void> {
    return this.request(`/admin/problem-statements/${id}`, {
      method: "DELETE",
    })
  }

  // Mentors
  async getMentors(): Promise<Mentor[]> {
    return this.request("/mentors")
  }

  async getMentorInfo(mentorId: string): Promise<Mentor> {
    return this.request(`/mentors/${mentorId}`)
  }

  async bookMentor(mentorId: string): Promise<void> {
    return this.request("/mentors/book", {
      method: "POST",
      body: JSON.stringify({ mentorId }),
    })
  }

  async getMentorQueue(mentorId: string): Promise<QueueItem[]> {
    return this.request(`/mentors/${mentorId}/queue`)
  }

  async markMentorshipResolved(queueItemId: string): Promise<void> {
    return this.request(`/mentors/queue/${queueItemId}/resolve`, {
      method: "POST",
    })
  }

  async updateMeetLink(link: string): Promise<void> {
    return this.request("/mentors/meet-link", {
      method: "POST",
      body: JSON.stringify({ meetLink: link }),
    })
  }

  // Judges
  async getJudges(): Promise<Judge[]> {
    return this.request("/judges")
  }

  async getTeamsForJudge(): Promise<Team[]> {
    return this.request("/judges/teams")
  }

  async submitScore(teamId: string, scores: TeamScore): Promise<void> {
    return this.request("/judges/score", {
      method: "POST",
      body: JSON.stringify({ teamId, scores }),
    })
  }

  async getTeamScore(teamId: string): Promise<TeamScore> {
    return this.request(`/judges/teams/${teamId}/score`)
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return this.request("/announcements")
  }

  async createAnnouncement(title: string, message: string): Promise<Announcement> {
    return this.request("/announcements", {
      method: "POST",
      body: JSON.stringify({ title, message }),
    })
  }

  // Submissions
  async submitProject(githubLink: string, pptLink: string): Promise<void> {
    return this.request("/submissions", {
      method: "POST",
      body: JSON.stringify({ githubLink, pptLink }),
    })
  }

  async getSubmissions(teamId: string): Promise<any[]> {
    return this.request(`/submissions/team/${teamId}`)
  }

  // Admin specific
  async getAllUsers(): Promise<User[]> {
    return this.request("/admin/users")
  }

  async toggleUserStatus(userId: string): Promise<void> {
    return this.request(`/admin/users/${userId}/toggle-status`, {
      method: "POST",
    })
  }

  async getLogs(): Promise<LogEntry[]> {
    return this.request("/admin/logs")
  }

  async getFilteredLogs(filters: LogFilter): Promise<LogEntry[]> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") params.append(key, value)
    })
    return this.request(`/admin/logs?${params.toString()}`)
  }

  async lockProblemStatements(locked: boolean): Promise<void> {
    return this.request("/admin/problem-statements/lock", {
      method: "POST",
      body: JSON.stringify({ locked }),
    })
  }

  async lockMentorship(locked: boolean): Promise<void> {
    return this.request("/admin/mentorship/lock", {
      method: "POST",
      body: JSON.stringify({ locked }),
    })
  }

  async promoteToRound2(teamIds: string[]): Promise<void> {
    return this.request("/admin/round2/promote", {
      method: "POST",
      body: JSON.stringify({ teamIds }),
    })
  }

  // Team-Judge Mapping
  async getTeamJudgeMappings(): Promise<TeamJudgeMapping[]> {
    return this.request("/admin/team-judge-mappings")
  }

  async mapTeamToJudge(teamId: string, judgeId: string): Promise<void> {
    return this.request("/admin/team-judge-mappings", {
      method: "POST",
      body: JSON.stringify({ teamId, judgeId }),
    })
  }

  async removeTeamJudgeMapping(teamId: string): Promise<void> {
    return this.request(`/admin/team-judge-mappings/${teamId}`, {
      method: "DELETE",
    })
  }

  async getTeamScores(): Promise<TeamScore[]> {
    return this.request("/admin/team-scores")
  }

  // Round 2 Room Management
  async getRound2Rooms(): Promise<Round2Room[]> {
    return this.request("/admin/round2/rooms")
  }

  async mapJudgeToRoom(judgeId: string, roomId: string): Promise<void> {
    return this.request("/admin/round2/map-judge", {
      method: "POST",
      body: JSON.stringify({ judgeId, roomId }),
    })
  }

  async assignTeamToRoom(teamId: string, roomId: string): Promise<void> {
    return this.request("/admin/round2/assign-team", {
      method: "POST",
      body: JSON.stringify({ teamId, roomId }),
    })
  }
}

export const apiService = new ApiService()
