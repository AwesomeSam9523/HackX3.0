"use client";

import { authService } from "./auth";
import type {
  Announcement,
  Checkpoint,
  Checkpoint2Data,
  Domain,
  Evaluation,
  Judge,
  LogEntry,
  LogFilter,
  Mentor,
  MentorshipSession,
  Participant,
  ProblemStatement,
  ProblemStatementForm,
  QueueItem,
  Round2Room,
  Scores,
  Submission,
  Team,
  TeamCheckpoint1Data,
  TeamJudgeMapping,
  TeamScore,
  User,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const routeTypes = {
  ADMIN: "admin",
  MENTOR: "mentors",
  JUDGE: "judges",
  TEAM: "teams",
  SUPER_ADMIN: "super-admin",
};

class ApiService {
  async getMyQueue(): Promise<QueueItem[]> {
    return this.request("/queue");
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

  // Enhanced Checkpoint 1 Management
  async getTeamForCheckpoint1(teamId: string): Promise<TeamCheckpoint1Data> {
    return this.request(`/team/${teamId}/checkpoint1`);
  }

  async addParticipantToTeam(
    teamId: string,
    participant: {
      name: string;
      email: string;
      phone?: string;
    },
  ): Promise<Participant> {
    return this.request(`/team/${teamId}/participants`, {
      method: "POST",
      body: JSON.stringify(participant),
    });
  }

  async removeParticipantFromTeam(participantId: string): Promise<void> {
    return this.request(`/participants/${participantId}`, {
      method: "DELETE",
    });
  }

  // New TeamParticipant management
  async getTeamParticipants(teamId: string): Promise<Participant[]> {
    return this.request(`/team/${teamId}/participants`);
  }

  async addTeamParticipant(
    teamId: string,
    participant: {
      name: string;
      email: string;
      phone?: string;
      role?: "MEMBER" | "LEADER";
    },
  ): Promise<Participant> {
    return this.request(`/team/${teamId}/participants/new`, {
      method: "POST",
      body: JSON.stringify(participant),
    });
  }

  async updateTeamParticipant(
    participantId: string,
    updates: {
      name?: string;
      email?: string;
      phone?: string;
      role?: "MEMBER" | "LEADER";
      isPresent?: boolean;
    },
  ): Promise<Participant> {
    return this.request(`/participants/${participantId}/update`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteTeamParticipant(participantId: string): Promise<void> {
    return this.request(`/participants/${participantId}/delete`, {
      method: "DELETE",
    });
  }

  async toggleParticipantPresence(
    participantId: string,
    isPresent: boolean,
  ): Promise<Participant> {
    return this.request(`/participants/${participantId}/presence`, {
      method: "PATCH",
      body: JSON.stringify({ isPresent }),
    });
  }

  async refreshTeamToCheckpoint1(
    teamId: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.request(`/team/${teamId}/refresh-to-checkpoint-1`, {
      method: "POST",
    });
  }

  // Create a new team manually
  async createTeam(data: {
    teamName: string;
    teamLeader: {
      name: string;
      email: string;
      phone?: string;
    };
    teamMembers: Array<{
      name: string;
      email: string;
      phone?: string;
    }>;
  }): Promise<{
    team: Team;
    teamLeader: Participant;
    teamMembers: Participant[];
    credentials: {
      teamId: string;
      password: string;
    };
  }> {
    return this.request("/teams/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Delete a team
  async deleteTeam(teamId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/teams/${teamId}`, {
      method: "DELETE",
    });
  }

  // Problem Statements
  async getDomains(): Promise<Domain[]> {
    return this.request("/domains");
  }

  async selectProblemStatement(
    psId: string,
  ): Promise<{ problemStatement: ProblemStatement }> {
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

  async getSelectedMentor(): Promise<MentorshipSession | null> {
    return this.request(`/mentors/selected`);
  }

  async getSelectedProblemStatement(): Promise<ProblemStatement | null> {
    return this.request("/problem-statements/selected");
  }

  async getBookmarkedPS(): Promise<ProblemStatement[]> {
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

  async getTeamScoresById(teamId: string): Promise<Scores | null> {
    return this.request(`/teams/${teamId}/score`);
  }

  async bookMentor(
    mentorId: string,
    query: string,
  ): Promise<MentorshipSession> {
    return this.request("/mentors/book", {
      method: "POST",
      body: JSON.stringify({ mentorId, query }),
    });
  }

  async getMentorQueue(mentorId: string): Promise<QueueItem[]> {
    return this.request(`/mentors/${mentorId}/queue`);
  }

  async markMentorshipResolved(queueItemId: string): Promise<void> {
    return this.request(`/queue/resolve`, {
      method: "POST",
      body: JSON.stringify({ queueItemId }),
    });
  }

  async updateMeetLink(link: string): Promise<void> {
    return this.request("/meet-link", {
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

  async getSubmissions(teamId: string): Promise<Submission[]> {
    return this.request(`/submissions/team/${teamId}`);
  }

  async getTeamSubmission(): Promise<Submission[]> {
    return this.request(`/submissions`);
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

  async getLockedOverview(): Promise<{
    problem_statements_locked: string;
    mentorship_locked: string;
    round1_locked: string;
  }> {
    return this.request(`/locked`);
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

  async getAuthProfile(): Promise<User> {
    return this.request("/auth/profile");
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

  async getProfile(): Promise<Judge | Mentor> {
    return this.request("/profile");
  }

  async getEvaluations(): Promise<Evaluation[]> {
    return this.request("/teams");
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

  async cancelMentorBooking(queueId: string): Promise<void> {
    return this.request("/mentors/cancel", {
      method: "POST",
      body: JSON.stringify({ queueId }),
    });
  }

  async submitScore(payload: {
    teamId: string;
    scores: {
      innovation: number;
      technical: number;
      feasibility: number;
      presentation: number;
      impact: number;
      feedback: string;
    };
  }): Promise<void> {
    return this.request("/score", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

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
      // If no token and not a login request, redirect to log in
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

  async getTeamPreviousMentorshipStatus() {
    return this.request<boolean>(`/mentorship-status-allowed`);
  }
}

export const apiService = new ApiService();
