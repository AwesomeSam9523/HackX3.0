"use client";

import { authService } from "./auth";
import type {
  Announcement,
  Domain,
  Judge,
  LogEntry,
  LogFilter,
  Mentor,
  ProblemStatement,
  ProblemStatementForm,
  QueueItem,
  Round2Room,
  Team,
  TeamJudgeMapping,
  TeamScore,
  User,
  Checkpoint,
  Checkpoint2Data,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const routeTypes = {
  ADMIN: "admin",
  MENTOR: "mentors",
  JUDGE: "judges",
  TEAM: "teams",
  SUPER_ADMIN: "super-admin",
};

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = authService.getToken();
    const user = authService.getUser();
    const routeType =
      user && !endpoint.startsWith("/auth") ? `/${routeTypes[user.role]}` : "";
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (!token && endpoint !== "/auth/login") {
      // If no token and not a login request, redirect to login
      authService.logout();
      throw new Error("Unauthorized");
    }

    const response = await fetch(
      `${API_BASE_URL}${routeType}${endpoint}`,
      config,
    );

    if (response.status === 401 || response.status === 403) {
      authService.logout();
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} at ${endpoint}`);
    }

    return response.json();
  }

  // Authentication
  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; user: User }> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    return this.request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async resetPassword(userId: string): Promise<{
    message: string;
    newPassword: string;
  }> {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  }

  // System Status
  async getSystemStatus(): Promise<{
    round1_locked: string;
    mentorship_locked: string;
    problem_statements_locked: string;
    round2_locked: string;
  }> {
    return this.request("/settings");
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    return this.request("/teams");
  }

  async getTeam(id: string): Promise<Team> {
    return this.request(`/teams/${id}`);
  }

  async getMyTeam(): Promise<Team> {
    return this.request("/team");
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team> {
    return this.request(`/teams/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateCheckpoint(
    checkpoint: number,
    data: unknown,
  ): Promise<Checkpoint | Checkpoint2Data> {
    return this.request(`/teams/checkpoint/${checkpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Problem Statements
  async getDomains(): Promise<Domain[]> {
    return this.request("/domains");
  }

  async selectProblemStatement(psId: string): Promise<void> {
    return this.request("/problem-statements/select", {
      method: "POST",
      body: JSON.stringify({ problemStatementId: psId }),
    });
  }

  async bookmarkProblemStatement(psId: string): Promise<void> {
    return this.request("/problem-statements/bookmark", {
      method: "POST",
      body: JSON.stringify({ problemStatementId: psId }),
    });
  }

  async getBookmarkedPS(): Promise<string[]> {
    return this.request("/problem-statements/bookmarks");
  }

  // Problem Statements Management
  async createProblemStatement(
    data: ProblemStatementForm,
  ): Promise<ProblemStatement> {
    const payload = {
      ...data,
      deliverables: data.deliverables.map((d) => d.value),
      domain: undefined,
    };
    return this.request("/problem-statements", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updateProblemStatement(
    id: string,
    data: ProblemStatementForm,
  ): Promise<ProblemStatement> {
    const payload = {
      ...data,
      deliverables: data.deliverables.map((d) => d.value),
      domain: undefined,
    };
    return this.request(`/problem-statements/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async deleteProblemStatement(id: string): Promise<void> {
    return this.request(`/problem-statements/${id}`, {
      method: "DELETE",
    });
  }

  // Mentors
  async getMentors(): Promise<Mentor[]> {
    return this.request("/mentors");
  }

  async getMentorInfo(mentorId: string): Promise<Mentor> {
    return this.request(`/mentors/${mentorId}`);
  }

  async bookMentor(mentorId: string): Promise<void> {
    return this.request("/mentors/book", {
      method: "POST",
      body: JSON.stringify({ mentorId }),
    });
  }

  async getMentorQueue(mentorId: string): Promise<QueueItem[]> {
    return this.request(`/mentors/${mentorId}/queue`);
  }

  async markMentorshipResolved(queueItemId: string): Promise<void> {
    return this.request(`/mentors/queue/${queueItemId}/resolve`, {
      method: "POST",
    });
  }

  async updateMeetLink(link: string): Promise<void> {
    return this.request("/mentors/meet-link", {
      method: "POST",
      body: JSON.stringify({ meetLink: link }),
    });
  }

  // Judges
  async getJudges(): Promise<Judge[]> {
    return this.request("/judges");
  }

  async getTeamsForJudge(): Promise<Team[]> {
    return this.request("/judges/teams");
  }

  async submitScore(teamId: string, scores: TeamScore): Promise<void> {
    return this.request("/judges/score", {
      method: "POST",
      body: JSON.stringify({ teamId, scores }),
    });
  }

  async getTeamScore(teamId: string): Promise<TeamScore> {
    return this.request(`/judges/teams/${teamId}/score`);
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return this.request("/announcements");
  }

  async createAnnouncement(
    title: string,
    message: string,
  ): Promise<Announcement> {
    return this.request("/announcements", {
      method: "POST",
      body: JSON.stringify({ title, message }),
    });
  }

  // Submissions
  async submitProject(githubLink: string, pptLink: string): Promise<void> {
    return this.request("/submissions", {
      method: "POST",
      body: JSON.stringify({ githubLink, pptLink }),
    });
  }

  async getSubmissions(teamId: string): Promise<unknown[]> {
    return this.request(`/submissions/team/${teamId}`);
  }

  // Admin specific
  async getAllUsers(): Promise<User[]> {
    return this.request("/users");
  }

  async toggleUserStatus(userId: string): Promise<void> {
    return this.request(`/users/${userId}/toggle`, {
      method: "POST",
    });
  }

  async getLogs(): Promise<LogEntry[]> {
    return this.request("/logs");
  }

  async getFilteredLogs(filters: LogFilter): Promise<LogEntry[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") params.append(key, value);
    });
    return this.request(`/logs?${params.toString()}`);
  }

  async getProblemStatements(): Promise<ProblemStatement[]> {
    return this.request("/problem-statements");
  }

  async lockProblemStatements(locked: boolean): Promise<{ locked: boolean }> {
    return this.request("/problem-statements/lock", {
      method: "POST",
      body: JSON.stringify({ locked }),
    });
  }

  async promoteToRound2(teamIds: string[]): Promise<void> {
    return this.request("/admin/round2/promote", {
      method: "POST",
      body: JSON.stringify({ teamIds }),
    });
  }

  // Team-Judge Mapping
  async getTeamJudgeMappings(): Promise<TeamJudgeMapping[]> {
    return this.request("/team-judge-mappings");
  }

  async mapTeamToJudge(teamId: string, judgeId: string): Promise<void> {
    return this.request("/team-judge-mappings", {
      method: "POST",
      body: JSON.stringify({ teamId, judgeId }),
    });
  }

  async removeTeamJudgeMapping(teamId: string, judgeId: string): Promise<void> {
    return this.request(`/team-judge-mappings/${teamId}/${judgeId}`, {
      method: "DELETE",
    });
  }

  async getTeamScores(): Promise<TeamScore[]> {
    return this.request("/team-scores");
  }

  // Round 2 Room Management
  async getRound2Rooms(): Promise<Round2Room[]> {
    return this.request("/round2/rooms");
  }

  async mapJudgeToRoom(judgeId: string, roomId: string): Promise<void> {
    return this.request("/round2/map-judge", {
      method: "POST",
      body: JSON.stringify({ judgeId, roomId }),
    });
  }

  async assignTeamToRoom(teamId: string, roomId: string): Promise<void> {
    return this.request("/round2/assign-team", {
      method: "POST",
      body: JSON.stringify({ teamId, roomId }),
    });
  }

  async getProfile(): Promise<User> {
    return this.request("/auth/profile");
  }

  async lockMentorship(locked: boolean): Promise<{ locked: boolean }> {
    return this.request("/mentorship/lock", {
      method: "POST",
      body: JSON.stringify({ locked }),
    });
  }

  async lockRound1(locked: boolean): Promise<{ locked: boolean }> {
    return this.request("/round1/lock", {
      method: "POST",
      body: JSON.stringify({ locked }),
    });
  }

  async addMentor(payload: {
    name: string;
    domain: string;
    mode: "ONLINE" | "OFFLINE";
  }): Promise<{ newMentor: Mentor; rawPassword: string }> {
    return this.request("/mentors", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async removeMentor(mentorId: string): Promise<void> {
    return this.request(`/mentors/${mentorId}`, {
      method: "DELETE",
    });
  }

  async addJudge(payload: {
    name: string;
  }): Promise<{ newJudge: Judge; rawPassword: string }> {
    return this.request("/judges", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async removeJudge(judgeId: string): Promise<void> {
    return this.request(`/judges/${judgeId}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
