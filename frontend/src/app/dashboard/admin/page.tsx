"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Megaphone,
  Eye,
  RefreshCw,
  UserCheck,
  Clock,
  Gavel,
  Search,
} from "lucide-react";
import { JudgeTeamMappingTab } from "@/components/admin/judge-team-mapping-tab";
import { Team, Judge } from "@/lib/types";

export default function AdminDashboard() {
  const [passwordChanged, setPasswordChanged] = useState(true); // Bypass password change logic
  const [announcement, setAnnouncement] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamSearch, setTeamSearch] = useState("");

  // Mock data with real-time updates
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "t1",
      teamName: "Code Warriors",
      problemStatement: "Smart Traffic Management System",
      roomNumber: "AB1-201",
      checkpoint1: true,
      checkpoint2: true,
      checkpoint3: false,
      credentialsGiven: true,
      status: "In Progress",
      wifiOptIn: true,
      generatedId: "TEAM1234",
      generatedPassword: "AbC123Xy",
      members: [],
    },
    {
      id: "t2",
      teamName: "Tech Innovators",
      problemStatement: "Healthcare Diagnosis Assistant",
      roomNumber: "AB1-203",
      checkpoint1: true,
      checkpoint2: false,
      checkpoint3: false,
      credentialsGiven: false,
      status: "Registration",
      wifiOptIn: false,
      generatedId: null,
      generatedPassword: null,
      members: [],
    },
    {
      id: "t3",
      teamName: "Digital Pioneers",
      problemStatement: "E-commerce Platform",
      roomNumber: "AB1-205",
      checkpoint1: false,
      checkpoint2: false,
      checkpoint3: false,
      credentialsGiven: false,
      status: "Not Started",
      wifiOptIn: false,
      generatedId: null,
      generatedPassword: null,
      members: [],
    },
  ]);

  const [judges, setJudges] = useState<Judge[]>([
    {
      id: "j1",
      name: "Prof. Michael Johnson",
      floor: "Ground Floor",
      teamsCompleted: 2,
      teamsLeft: 6,
      status: "Active",
      round: 1,
    },
    {
      id: "j2",
      name: "Dr. Sarah Wilson",
      floor: "First Floor",
      teamsCompleted: 4,
      teamsLeft: 4,
      status: "Active",
      round: 1,
    },
  ]);

  const [mentors, setMentors] = useState([
    {
      id: "m1",
      name: "Dr. Sarah Chen",
      domain: "AI/ML",
      currentQueue: 3,
      maxCapacity: 5,
      status: "Available",
    },
    {
      id: "m2",
      name: "Prof. Mike Johnson",
      domain: "Web Development",
      currentQueue: 5,
      maxCapacity: 5,
      status: "Full",
    },
  ]);

  const problemStatements = [
    {
      id: "ps1",
      title: "Smart Traffic Management System",
      domain: "AI/ML",
      selectedCount: 12,
    },
    {
      id: "ps2",
      title: "Healthcare Diagnosis Assistant",
      domain: "Healthcare",
      selectedCount: 8,
    },
    {
      id: "ps3",
      title: "E-commerce Platform",
      domain: "Web Development",
      selectedCount: 15,
    },
  ];

  // Add filtered teams logic
  const filteredTeams = teams.filter((team) =>
    team.teamName.toLowerCase().includes(teamSearch.toLowerCase()),
  );

  // Helper functions for checkpoint management
  const generateTeamId = () => {
    return `TEAM${Math.floor(Math.random() * 9000) + 1000}`;
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleWifiOptIn = (teamId: string, optIn: boolean) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, wifiOptIn: optIn } : team,
      ),
    );
  };

  const handleCheckpoint1Complete = (teamId: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? { ...team, checkpoint1: true, status: "Checkpoint 1 Complete" }
          : team,
      ),
    );
  };

  const handleCheckpoint2Complete = (teamId: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
              ...team,
              checkpoint2: true,
              credentialsGiven: true,
              generatedId: team.generatedId || generateTeamId(),
              generatedPassword: team.generatedPassword || generatePassword(),
              status: "Checkpoint 2 Complete",
            }
          : team,
      ),
    );
  };

  const handleCheckpoint3Complete = (teamId: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? { ...team, checkpoint3: true, status: "Complete" }
          : team,
      ),
    );
  };

  useEffect(() => {
    // Simulate real-time updates via WebSocket
    const interval = setInterval(() => {
      // Update team statuses, judge progress, etc.
      console.log("Real-time update via WebSocket");
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleResetPassword = (teamId: string) => {
    console.log(`Resetting password for team: ${teamId}`);
    // Implementation for password reset
  };

  const handlePostAnnouncement = () => {
    if (announcement.trim()) {
      console.log("Posting announcement:", announcement);
      setAnnouncement("");
    }
  };

  return (
    <div className="text-offblack min-h-screen bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col space-y-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
            <p className="mt-1 text-sm sm:text-base">
              Hackathon Management Control Center
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="default"
              className="bg-green-500 text-xs sm:text-sm"
            >
              <RefreshCw className="mr-1 h-3 w-3" />
              Live Updates
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-max min-w-[700px] grid-cols-6 sm:w-full sm:min-w-0">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="teams" className="text-xs sm:text-sm">
                Teams
              </TabsTrigger>
              <TabsTrigger value="judges" className="text-xs sm:text-sm">
                Judges
              </TabsTrigger>
              <TabsTrigger value="judge-mapping" className="text-xs sm:text-sm">
                Judge Mapping
              </TabsTrigger>
              <TabsTrigger value="mentors" className="text-xs sm:text-sm">
                Mentors
              </TabsTrigger>
              <TabsTrigger value="announcements" className="text-xs sm:text-sm">
                Announcements
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                    Total Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-hackx text-2xl font-bold sm:text-3xl">
                    {teams.length}
                  </div>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Registered teams
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                    Completed CP3
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-hackx text-2xl font-bold sm:text-3xl">
                    {teams.filter((team) => team.checkpoint3).length}
                  </div>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Ready for judging
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Gavel className="h-4 w-4 sm:h-5 sm:w-5" />
                    Judges Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-hackx text-2xl font-bold sm:text-3xl">
                    {judges.length}
                  </div>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Currently evaluating
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                    Avg. Evaluation Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-hackx text-2xl font-bold sm:text-3xl">
                    12m
                  </div>
                  <p className="text-xs text-slate-500 sm:text-sm">Per team</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Problem Statement Statistics
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Distribution of team selections across problem statements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {problemStatements.map((ps) => (
                      <div
                        key={ps.id}
                        className="flex flex-col space-y-2 rounded-lg bg-gray-100 p-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-medium sm:text-base">
                            {ps.title}
                          </span>
                          <p className="text-xs text-slate-500 sm:text-sm">
                            {ps.domain}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-offblack w-fit text-xs"
                        >
                          {ps.selectedCount} teams
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Registration Status
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Real-time checkpoint completion status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teams.slice(0, 5).map((team) => (
                      <div
                        key={team.id}
                        className="flex flex-col space-y-3 rounded-lg bg-gray-100 p-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0"
                      >
                        <div className="flex-1">
                          <h4 className="text-sm font-medium sm:text-base">
                            {team.teamName}
                          </h4>
                          <p className="text-xs break-all text-slate-500 sm:text-sm">
                            ID: {team.generatedId} | Room: {team.roomNumber}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                team.checkpoint1 ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              CP1
                            </Badge>
                            <Badge
                              variant={
                                team.checkpoint2 ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              CP2
                            </Badge>
                            <Badge
                              variant={
                                team.checkpoint3 ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              CP3
                            </Badge>
                          </div>
                          <Badge variant="outline" className="w-fit text-xs">
                            {team.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="registration">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Registration Status
                </CardTitle>
                <CardDescription className="text-sm">
                  Real-time checkpoint completion status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex flex-col space-y-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
                    >
                      <div>
                        <h4 className="text-sm font-medium sm:text-base">
                          {team.teamName}
                        </h4>
                        <p className="text-xs text-slate-500 sm:text-sm">
                          Room: {team.roomNumber}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={team.checkpoint1 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            CP1
                          </Badge>
                          <Badge
                            variant={team.checkpoint2 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            CP2
                          </Badge>
                          <Badge
                            variant={team.checkpoint3 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            CP3
                          </Badge>
                        </div>
                        <Badge variant="outline" className="w-fit text-xs">
                          {team.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Registration Checkpoints
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent sm:w-auto"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Real-time Updates
                </Button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">
                        Checkpoint 1
                      </CardTitle>
                      <CardDescription className="text-sm">
                        AB1 Entrance & Main Gate
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-xs sm:text-sm">
                        <li>• Team details confirmation</li>
                        <li>• Govt ID verification</li>
                        <li>• Consent form collection</li>
                        <li>• WiFi opt-in form</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">
                        Checkpoint 2
                      </CardTitle>
                      <CardDescription className="text-sm">
                        AB1 Lobby
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-xs sm:text-sm">
                        <li>• Participant ID cards</li>
                        <li>• Welcome kits distribution</li>
                        <li>• Team login creation</li>
                        <li>• Website credentials</li>
                        <li>• Room number assignment</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">
                        Checkpoint 3
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Auditorium Entrance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-xs sm:text-sm">
                        <li>• Confirm checkpoint 1 & 2</li>
                        <li>• Final verification</li>
                        <li>• Entry to hackathon venue</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Search Bar */}
              <CardContent className="px-0">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Input
                    placeholder="Search teams..."
                    className="flex-1 text-sm outline-none border-border"
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    className="w-full bg-transparent sm:w-auto"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </CardContent>

              <div className="space-y-4">
                {filteredTeams.map((team) => (
                  <Card key={team.id}>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <div className="flex-1">
                          <CardTitle className="text-base sm:text-lg">
                            {team.teamName}
                          </CardTitle>
                          <CardDescription className="mt-1 text-sm">
                            {team.problemStatement}
                          </CardDescription>
                          <p className="mt-1 text-xs break-all text-slate-500 sm:text-sm">
                            Team ID: {team.generatedId} | Room: {team.roomNumber}
                          </p>
                        </div>
                        <div className="text-left lg:text-right">
                          <p className="text-xs text-slate-500 sm:text-sm">
                            Status
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {team.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Checkpoint Status */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={team.checkpoint1 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          CP1
                        </Badge>
                        <Badge
                          variant={team.checkpoint2 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          CP2
                        </Badge>
                        <Badge
                          variant={team.checkpoint3 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          CP3
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {team.status}
                        </Badge>
                      </div>

                      {/* Checkpoint Actions */}
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {/* Checkpoint 1 */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={team.checkpoint1}
                              className="bg-transparent text-xs"
                            >
                              {team.checkpoint1
                                ? "CP1 Complete"
                                : "Checkpoint 1"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-lg">
                                Checkpoint 1 - {team.teamName}
                              </DialogTitle>
                              <DialogDescription className="text-sm">
                                Team details confirmation and WiFi opt-in
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={`wifi-${team.id}`}
                                  checked={team.wifiOptIn || false}
                                  onCheckedChange={(checked) =>
                                    handleWifiOptIn(team.id, checked)
                                  }
                                />
                                <Label
                                  htmlFor={`wifi-${team.id}`}
                                  className="text-sm"
                                >
                                  WiFi Opt-in
                                </Label>
                              </div>
                            </div>
                            <DialogFooter className="flex-col gap-2 sm:flex-row">
                              <Button
                                onClick={() =>
                                  handleCheckpoint1Complete(team.id)
                                }
                                className="w-full sm:w-auto bg-hackx text-white"
                              >
                                Complete Checkpoint 1
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Checkpoint 2 */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={team.checkpoint2 || !team.checkpoint1}
                              className="bg-transparent text-xs"
                            >
                              {team.checkpoint2
                                ? "CP2 Complete"
                                : "Checkpoint 2"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-lg">
                                Checkpoint 2 - {team.teamName}
                              </DialogTitle>
                              <DialogDescription className="text-sm">
                                Generate team credentials and distribute
                                materials
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="rounded-lg bg-slate-50 p-4">
                                <h4 className="mb-2 text-sm font-medium">
                                  Team Credentials
                                </h4>
                                <div className="space-y-2">
                                  <div>
                                    <Label className="text-xs font-medium">
                                      Team ID:
                                    </Label>
                                    <p className="font-mono text-sm sm:text-base">
                                      {team.generatedId || generateTeamId()}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-xs font-medium">
                                      Password:
                                    </Label>
                                    <p className="font-mono text-sm sm:text-base">
                                      {team.generatedPassword ||
                                        generatePassword()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs text-slate-600 sm:text-sm">
                                <p>✓ Participant ID cards distributed</p>
                                <p>✓ Welcome kits given</p>
                                <p>✓ Room number assigned: {team.roomNumber}</p>
                              </div>
                            </div>
                            <DialogFooter className="flex-col gap-2 sm:flex-row">
                              <Button
                                onClick={() =>
                                  handleCheckpoint2Complete(team.id)
                                }
                                className="w-full sm:w-auto bg-hackx text-white border-[1px] hover:text-hackx hover:border-hackx"
                              >
                                Complete Checkpoint 2
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Checkpoint 3 */}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={team.checkpoint3 || !team.checkpoint2}
                          onClick={() => handleCheckpoint3Complete(team.id)}
                          className="text-xs"
                        >
                          {team.checkpoint3 ? "CP3 Complete" : "Checkpoint 3"}
                        </Button>
                      </div>

                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              team.credentialsGiven ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {team.credentialsGiven
                              ? "Credentials Given"
                              : "Pending"}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResetPassword(team.id)}
                          className="w-full text-xs sm:w-auto"
                        >
                          Reset Password
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="judges">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl font-bold sm:text-2xl">
                Judge Management
              </h2>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Judge Progress Overview
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Monitor evaluation progress - scores are hidden from admin
                    view
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {judges.map((judge) => (
                      <Card
                        key={judge.id}
                        className="border-l-4 border-l-hackx"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                              <CardTitle className="text-base sm:text-lg">
                                {judge.name}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {judge.floor}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={
                                judge.status === "Active"
                                  ? "default"
                                  : "secondary"
                              }
                              className="w-fit text-xs"
                            >
                              {judge.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <p className="text-xl font-bold text-green-600 sm:text-2xl">
                                  {judge.teamsCompleted}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Completed
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xl font-bold text-orange-600 sm:text-2xl">
                                  {judge.teamsLeft}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Remaining
                                </p>
                              </div>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-200 sm:w-32">
                              <div
                                className="h-2 rounded-full bg-green-500"
                                style={{
                                  width: `${(judge.teamsCompleted / (judge.teamsCompleted + judge.teamsLeft)) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="judge-mapping">
            <JudgeTeamMappingTab judges={judges} teams={teams} />
          </TabsContent>

          <TabsContent value="mentors">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl font-bold sm:text-2xl">
                Mentor Queue Management
              </h2>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Mentor Status Overview
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Real-time mentor queue status and availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mentors.map((mentor) => (
                      <Card
                        key={mentor.id}
                        className="border-l-4 border-l-hackx"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                              <CardTitle className="text-base sm:text-lg">
                                {mentor.name}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {mentor.domain}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={
                                mentor.status === "Available"
                                  ? "outline"
                                  : "default"
                              }
                              className={`w-fit text-xs ${mentor.status === 'Available' ? 'text-hackx border-hackx border-[1px]' : ''}`}
                            >
                              {mentor.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <p className="text-xl font-bold text-blue-600 sm:text-2xl">
                                  {mentor.currentQueue}/{mentor.maxCapacity}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Queue Status
                                </p>
                              </div>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full bg-transparent text-xs sm:w-auto"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Queue
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="w-[95vw] max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-lg">
                                    {mentor.name} - Queue Details
                                  </DialogTitle>
                                  <DialogDescription className="text-sm">
                                    Current teams in mentorship queue
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2">
                                  <p className="text-sm text-slate-600">
                                    Queue implementation would show team details
                                    here
                                  </p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl font-bold sm:text-2xl">
                Announcement Management
              </h2>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Megaphone className="h-4 w-4 sm:h-5 sm:w-5" />
                    Post New Announcement
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Broadcast important updates to all participants
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="announcement-title" className="text-sm">
                      Announcement Title
                    </Label>
                    <Input
                      id="announcement-title"
                      placeholder="Enter announcement title"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="announcement-message" className="text-sm">
                      Message
                    </Label>
                    <Textarea
                      id="announcement-message"
                      placeholder="Enter your announcement message..."
                      value={announcement}
                      onChange={(e) => setAnnouncement(e.target.value)}
                      rows={4}
                      className="text-sm"
                    />
                  </div>
                  <Button
                    onClick={handlePostAnnouncement}
                    className="w-full text-sm"
                    variant="default"
                  >
                    <Megaphone className="mr-2 h-4 w-4" />
                    Post Announcement
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Recent Announcements
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Previously posted announcements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="rounded-lg border p-3">
                      <div className="mb-2 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <h4 className="text-sm font-medium sm:text-base">
                          Lunch Break
                        </h4>
                        <Badge variant="outline" className="w-fit text-xs">
                          11:30 AM
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 sm:text-sm">
                        Lunch will be served from 12:30 PM to 1:30 PM in the
                        cafeteria.
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="mb-2 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <h4 className="text-sm font-medium sm:text-base">
                          Mentorship Round
                        </h4>
                        <Badge variant="outline" className="w-fit text-xs">
                          1:00 PM
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 sm:text-sm">
                        Mentorship round will begin at 2:00 PM. Please book your
                        slots.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
