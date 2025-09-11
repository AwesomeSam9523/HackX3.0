"use client";

import { useEffect, useState } from "react";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Eye,
  Gavel,
  Megaphone,
  RefreshCw,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import { JudgeTeamMappingTab } from "@/components/admin/judge-team-mapping-tab";
import {
  Announcement,
  Checkpoint,
  Checkpoint2Data,
  Judge,
  Mentor,
  ProblemStatement,
  Team,
  WebsocketData,
} from "@/lib/types";
import { apiService } from "@/lib/service";
import { wsService } from "@/lib/ws";
import { authService } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

function isCheckpointCompleted(team: Team, checkpoint: number) {
  return team.checkpoints.some(
    (c) => c.checkpoint === checkpoint && c.status === "COMPLETED",
  );
}

function ago(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const amount = Math.floor(seconds / value);
    if (amount >= 1) {
      return amount === 1 ? `${amount} ${unit} ago` : `${amount} ${unit}s ago`;
    }
  }
  return "Just Now";
}

export default function AdminDashboard() {
  // const [passwordChanged, setPasswordChanged] = useState(true); // Bypass password change logic
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [wifiOptIn, setWifiOptIn] = useState(false);
  const [checkpoint1DialogOpen, setCheckpoint1DialogOpen] = useState(false);
  const [checkpoint2Data, setCheckpoint2Data] = useState({
    username: "",
    password: "",
    round1Room: "",
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [socket, setSocket] = useState<WebSocket>();

  // Mock data with real-time updates
  const [teams, setTeams] = useState<Team[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [problemStatements, setProblemStatements] = useState<
    ProblemStatement[]
  >([]);
  const { toast } = useToast();

  // Add filtered teams logic
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(teamSearch.toLowerCase()),
  );

  function updateTeamCheckpoint(teamId: string, checkpoint: Checkpoint) {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? { ...team, checkpoints: [...team.checkpoints, checkpoint] }
          : team,
      ),
    );
  }

  function updateWebsocketCheckpoint(checkpoint: Checkpoint) {
    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "checkpoint",
        checkpoint,
      }),
    );
  }

  const handleCheckpoint1Complete = async (teamId: string, wifi: boolean) => {
    const checkpoint = (await apiService.updateCheckpoint(1, {
      teamId,
      wifi,
    })) as Checkpoint;
    updateWebsocketCheckpoint(checkpoint);
    updateTeamCheckpoint(teamId, checkpoint);
    setCheckpoint1DialogOpen(false);
  };

  const handleCheckpoint2Complete = async (teamId: string) => {
    const { username, password, round1Room, checkpoint } =
      (await apiService.updateCheckpoint(2, { teamId })) as Checkpoint2Data;
    updateWebsocketCheckpoint(checkpoint);
    setCheckpoint2Data({
      username,
      password,
      round1Room: round1Room.block + "-" + round1Room.name,
    });
    updateTeamCheckpoint(teamId, checkpoint);
  };

  const handleCheckpoint3Complete = async (teamId: string) => {
    const checkpoint = (await apiService.updateCheckpoint(3, {
      teamId,
    })) as Checkpoint;
    updateWebsocketCheckpoint(checkpoint);
    updateTeamCheckpoint(teamId, checkpoint);
  };

  async function onWebsocketMessage(ws: WebSocket, ev: MessageEvent) {
    const data = JSON.parse(ev.data) as WebsocketData;
    console.log(data);
    if (data.type === "authenticated") {
      setAuthenticated(true);
      ws.send(
        JSON.stringify({
          type: "subscribe_checkpoints",
        }),
      );
    }

    if (!authenticated) {
      return;
    }

    if (data.type === "checkpoint") {
      updateTeamCheckpoint(data.teamId, data.checkpoint);
    } else if (data.type === "subscribed") {
      toast({
        title: "Event subscribed!",
        description: `Updating ${data.channel} in real time`,
      });
    }
  }

  async function handleWebsocket(ws: WebSocket) {
    setSocket(ws);
    ws.send(
      JSON.stringify({
        type: "authenticate",
        token: authService.getToken(),
      }),
    );
    ws.onmessage = (data) => onWebsocketMessage(ws, data);
  }

  useEffect(() => {
    apiService.getTeams().then(setTeams);
    apiService.getJudges().then(setJudges);
    apiService.getMentors().then(setMentors);
    apiService.getProblemStatements().then(setProblemStatements);
    apiService.getAnnouncements().then(setAnnouncements);
    wsService.connect().then(handleWebsocket);

    return () => {
      wsService.disconnect();
    };
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
                    {
                      teams.filter((team) => isCheckpointCompleted(team, 3))
                        .length
                    }
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
                            {ps.domain.name}
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
                            {team.name}
                          </h4>
                          <p className="text-xs break-all text-slate-500 sm:text-sm">
                            ID: {team.generatedId} | Room: {team.roomNumber}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                isCheckpointCompleted(team, 1)
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              CP1
                            </Badge>
                            <Badge
                              variant={
                                isCheckpointCompleted(team, 2)
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              CP2
                            </Badge>
                            <Badge
                              variant={
                                isCheckpointCompleted(team, 3)
                                  ? "default"
                                  : "secondary"
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
                          {team.name}
                        </h4>
                        <p className="text-xs text-slate-500 sm:text-sm">
                          Room: {team.roomNumber}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              isCheckpointCompleted(team, 1)
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            CP1
                          </Badge>
                          <Badge
                            variant={
                              isCheckpointCompleted(team, 2)
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            CP2
                          </Badge>
                          <Badge
                            variant={
                              isCheckpointCompleted(team, 3)
                                ? "default"
                                : "secondary"
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
                    className="border-border flex-1 text-sm outline-none"
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
                            {team.name}
                          </CardTitle>
                          <CardDescription className="mt-1 text-sm">
                            {team.problemStatement.title}
                          </CardDescription>
                          <p className="mt-1 text-xs break-all text-slate-500 sm:text-sm">
                            Team ID: {team.generatedId} | Room:{" "}
                            {team.roomNumber}
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
                          variant={
                            isCheckpointCompleted(team, 1)
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          CP1
                        </Badge>
                        <Badge
                          variant={
                            isCheckpointCompleted(team, 2)
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          CP2
                        </Badge>
                        <Badge
                          variant={
                            isCheckpointCompleted(team, 3)
                              ? "default"
                              : "secondary"
                          }
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
                        <Dialog
                          open={checkpoint1DialogOpen}
                          onOpenChange={setCheckpoint1DialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isCheckpointCompleted(team, 1)}
                              className="bg-transparent text-xs"
                            >
                              {isCheckpointCompleted(team, 1)
                                ? "CP1 Complete"
                                : "Checkpoint 1"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-lg">
                                Checkpoint 1 - {team.name}
                              </DialogTitle>
                              <DialogDescription className="text-sm">
                                Team details confirmation and WiFi opt-in
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={`wifi-${team.id}`}
                                  checked={wifiOptIn}
                                  onCheckedChange={(checked) =>
                                    setWifiOptIn(checked)
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
                                  handleCheckpoint1Complete(team.id, wifiOptIn)
                                }
                                className="bg-hackx w-full text-white sm:w-auto"
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
                              disabled={
                                isCheckpointCompleted(team, 2) ||
                                !isCheckpointCompleted(team, 1)
                              }
                              className="bg-transparent text-xs"
                              onClick={() => handleCheckpoint2Complete(team.id)}
                            >
                              {isCheckpointCompleted(team, 2)
                                ? "CP2 Complete"
                                : "Checkpoint 2"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-lg">
                                Checkpoint 2 - {team.name}
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
                                      {checkpoint2Data.username}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-xs font-medium">
                                      Password:
                                    </Label>
                                    <p className="font-mono text-sm sm:text-base">
                                      {checkpoint2Data.password}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-xs font-medium">
                                      Room Number:
                                    </Label>
                                    <p className="font-mono text-sm sm:text-base">
                                      {checkpoint2Data.round1Room}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs text-slate-600 sm:text-sm">
                                <p>✓ Participant ID cards distributed</p>
                                <p>✓ Welcome kits given</p>
                              </div>
                            </div>
                            <DialogFooter className="flex-col gap-2 sm:flex-row">
                              <DialogClose className="bg-hackx hover:text-hackx hover:border-hackx w-full rounded-sm border-[1px] px-3 py-1 text-white hover:bg-white sm:w-auto">
                                Done
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Checkpoint 3 */}
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={
                            isCheckpointCompleted(team, 3) ||
                            !isCheckpointCompleted(team, 2)
                          }
                          onClick={() => handleCheckpoint3Complete(team.id)}
                          className="text-xs"
                        >
                          {isCheckpointCompleted(team, 3)
                            ? "CP3 Complete"
                            : "Checkpoint 3"}
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
                        className="border-l-hackx border-l-4"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                              <CardTitle className="text-base sm:text-lg">
                                {judge.user.username}
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
                        className="border-l-hackx border-l-4"
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
                              className={`w-fit text-xs ${mentor.status === "Available" ? "text-hackx border-hackx border-[1px]" : ""}`}
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
                                  {mentor.currentQueue}/5
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
                                    {mentor.user.username} - Queue Details
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
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      // Made announcement cards responsive
                      <div
                        key={announcement.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="mb-2 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                          <h4 className="text-sm font-medium sm:text-base">
                            {announcement.title}
                          </h4>
                          <Badge variant="outline" className="w-fit text-xs">
                            {ago(announcement.createdAt)}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 sm:text-sm">
                          {announcement.message}
                        </p>
                      </div>
                    ))}
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
