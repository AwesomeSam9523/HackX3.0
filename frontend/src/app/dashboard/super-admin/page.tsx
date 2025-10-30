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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Eye,
  FileText,
  Lock,
  Plus,
  Settings,
  Shield,
  Trash2,
  Trophy,
  Unlock,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react"; // Add these imports at the top
import { ProblemStatementManagement } from "@/components/super-admin/problem-statement-management";
import { TeamJudgeMapping } from "@/components/super-admin/team-judge-mapping";
import { Round2RoomMapping } from "@/components/super-admin/round2-room-mapping";
import { ActivityLogs } from "@/components/super-admin/activity-logs";
import { UserManagementTab } from "@/components/super-admin/user-management-tab";
import { TeamPage } from "@/components/super-admin/team-page";
import { apiService } from "@/lib/service";
import {
  Announcement,
  Judge,
  LogEntry,
  Mentor,
  ProblemStatement,
  Team,
  User,
} from "@/lib/types";
import { authService } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface MentorDetails {
  name: string;
  domain: string;
  mode: "ONLINE" | "OFFLINE";
}

export default function SuperAdminDashboard() {
  const [passwordChanged, setPasswordChanged] = useState(true);
  const [psLocked, setPsLocked] = useState(false);
  const [mentorshipLocked, setMentorshipLocked] = useState(false);
  const [round1Locked, setRound1Locked] = useState(false);
  const [round2Locked, setRound2Locked] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementDescription, setAnnouncementDescription] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [problemStatements, setProblemStatements] = useState<
    ProblemStatement[]
  >([]);
  const [addMentorDetails, setAddMentorDetails] = useState({
    name: "",
    domain: "",
    mode: "ONLINE",
  });
  const [addJudgeDetails, setAddJudgeDetails] = useState({
    name: "",
  });

  const { toast } = useToast();

  useEffect(function getAllData() {
    apiService.getSystemStatus().then((data) => {
      setPsLocked(data.problem_statements_locked === "true");
      setMentorshipLocked(data.mentorship_locked === "true");
      setRound1Locked(data.round1_locked === "true");
      setRound2Locked(data.round2_locked === "true");
    });

    apiService.getAllUsers().then(setUsers);
    apiService.getTeams().then(setTeams);
    apiService.getJudges().then(setJudges);
    apiService.getLogs().then(setLogs);
    apiService.getProblemStatements().then(setProblemStatements);
    apiService.getAnnouncements().then(setAnnouncements);
    apiService.getMentors().then(setMentors);
  }, []);

  // Add refresh functions
  const refreshProblemStatements = async () => {
    try {
      apiService.getProblemStatements().then(setProblemStatements);
    } catch (error) {
      console.error("Failed to refresh problem statements:", error);
    }
  };

  const refreshLogs = async () => {
    try {
      const data = await apiService.getLogs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to refresh logs:", error);
    }
  };

  async function handleTogglePSLock(locked: boolean) {
    await apiService.lockProblemStatements(locked);
    setPsLocked(!psLocked);
    const user = authService.getUser();
    if (!user) {
      console.error("User not found");
      return;
    }
    // Add log entry
    const newLog = {
      id: logs.length + 1,
      createdAt: new Date().toLocaleString(),
      action: "TOGGLE_PS_LOCK",
      user,
      payload: JSON.stringify({ locked: !psLocked }),
      details: "",
    };
    setLogs((prev) => [newLog, ...prev]);
  }

  const handleToggleMentorshipLock = async () => {
    const user = authService.getUser();
    if (!user) {
      console.error("User not found");
      return;
    }
    const { locked } = await apiService.lockMentorship(!mentorshipLocked);
    setMentorshipLocked(locked);
    const newLog = {
      id: logs.length + 1,
      createdAt: new Date().toLocaleString(),
      action: locked ? "Mentorship Unlocked" : "Mentorship Locked",
      user: user,
      details: `Mentorship booking ${mentorshipLocked ? "unlocked" : "locked"}`,
      payload: JSON.stringify({ locked: !mentorshipLocked }),
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleAnnouncementPost = async () => {
    await apiService.createAnnouncement(
      announcementTitle,
      announcementDescription,
    );
    setIsAnnouncementOpen(false);
    toast({
      title: "Success",
      description: "Announcement sent successfully",
    });
  };

  const handleToggleRound1Lock = async () => {
    const user = authService.getUser();
    if (!user) {
      console.error("User not found");
      return;
    }
    const { locked } = await apiService.lockRound1(!round1Locked);
    setRound1Locked(locked);
    const newLog = {
      id: logs.length + 1,
      createdAt: new Date().toLocaleString(),
      action: locked ? "Round 1 Unlocked" : "Round 1 Locked",
      user: user,
      details: `Round 1 evaluation ${round1Locked ? "unlocked" : "locked"}`,
      payload: JSON.stringify({ locked: !round1Locked }),
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleAddMentor = async () => {
    const { newMentor, rawPassword } = await apiService.addMentor(
      addMentorDetails as MentorDetails,
    );
    const username = addMentorDetails.name.toLowerCase().replace(/\s+/g, "_");
    setMentors((prev) => [...prev, newMentor]);
    alert(
      `Mentor added successfully.\nUsername: ${username}\nPassword: ${rawPassword}`,
    );
  };

  const handleRemoveMentor = async (mentorId: string) => {
    await apiService.removeMentor(mentorId);
    setMentors((prev) => prev.filter((m) => m.id !== mentorId));
  };

  const handleAddJudge = async () => {
    const { newJudge, rawPassword } =
      await apiService.addJudge(addJudgeDetails);
    const username = newJudge.user.username;
    setJudges((prev) => [...prev, newJudge]);
    alert(
      `Judge added successfully.\nUsername: ${username}\nPassword: ${rawPassword}`,
    );
  };

  const handleRemoveJudge = async (judgeId: string) => {
    await apiService.removeJudge(judgeId);
    setJudges((prev) => prev.filter((judge) => judge.id !== judgeId));
    toast({
      title: "Success",
      description: "Judge removed successfully",
    });
  };

  // const handlePromoteToRound2 = (teamIds: string[]) => {
  //   setTeams((prev) =>
  //     prev.map((team) =>
  //       teamIds.includes(team.id)
  //         ? {
  //             ...team,
  //             round2Status: "Selected",
  //             round2Room: `AB2-${Math.floor(Math.random() * 400) + 300}`,
  //           }
  //         : team,
  //     ),
  //   );
  // };

  function ago(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
        return amount === 1
          ? `${amount} ${unit} ago`
          : `${amount} ${unit}s ago`;
      }
    }
    return "Just Now";
  }

  if (!passwordChanged) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
        <Card className="w-full max-w-sm sm:max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg sm:text-xl">
              Change Password Required
            </CardTitle>
            <CardDescription className="text-sm">
              You must change your password before accessing the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm">
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm">
                New Password
              </Label>
              <Input id="new-password" type="password" className="text-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                className="text-sm"
              />
            </div>
            <Button
              className="w-full text-sm"
              onClick={() => setPasswordChanged(true)}
            >
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col space-y-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              <Shield className="h-6 w-6 text-red-500 sm:h-8 sm:w-8" />
              Super Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Complete system control and monitoring
            </p>
          </div>
          <Alert className="w-full sm:w-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Super Admin privileges active
            </AlertDescription>
          </Alert>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-max min-w-[800px] grid-cols-9 sm:w-full sm:min-w-0">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="problem-statements"
                className="text-xs sm:text-sm"
              >
                Problem Statements
              </TabsTrigger>
              <TabsTrigger value="mentorship" className="text-xs sm:text-sm">
                Mentorship
              </TabsTrigger>
              <TabsTrigger value="judgement" className="text-xs sm:text-sm">
                Judgement
              </TabsTrigger>
              <TabsTrigger value="round2" className="text-xs sm:text-sm">
                Round 2
              </TabsTrigger>
              <TabsTrigger value="teams" className="text-xs sm:text-sm">
                Teams
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs sm:text-sm">
                Users
              </TabsTrigger>
              <TabsTrigger value="logs" className="text-xs sm:text-sm">
                Logs
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
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">
                      Problem Statements
                    </span>
                    <Badge
                      variant={psLocked ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {psLocked ? "Locked" : "Open"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Mentorship</span>
                    <Badge
                      variant={mentorshipLocked ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {mentorshipLocked ? "Locked" : "Open"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Round 1</span>
                    <Badge
                      variant={round1Locked ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {round1Locked ? "Locked" : "Open"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Round 2</span>
                    <Badge
                      variant={round2Locked ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {round2Locked ? "Locked" : "Open"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 sm:text-3xl">
                    {users.filter((u) => u.status === "ACTIVE").length}
                  </div>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Total active users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
                    Round 2 Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 sm:text-3xl">
                    {
                      teams.filter((t) => t.status === "ROUND1_QUALIFIED")
                        .length
                    }
                  </div>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Promoted to Round 2
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                    System Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600 sm:text-3xl">
                    {logs.length}
                  </div>
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Total log entries
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="problem-statements">
            <div className="space-y-4 sm:space-y-6">
              <ProblemStatementManagement
                problemStatements={problemStatements}
                psLocked={psLocked}
                onUpdateAction={refreshProblemStatements}
                onToggleAction={handleTogglePSLock}
              />
            </div>
          </TabsContent>

          <TabsContent value="mentorship">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Mentorship Management
                </h2>
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Mentor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-lg">
                          Add New Mentor
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                          Add a new mentor to the system
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="mentor-name" className="text-sm">
                            Name
                          </Label>
                          <Input
                            id="mentor-name"
                            placeholder="Dr. Juhi Singh"
                            className="text-sm"
                            value={addMentorDetails.name}
                            onChange={(e) =>
                              setAddMentorDetails((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mentor-domain" className="text-sm">
                            Domain
                          </Label>
                          <Input
                            id="mentor-name"
                            placeholder="Full Stack Developer"
                            className="text-sm"
                            value={addMentorDetails.domain}
                            onChange={(e) =>
                              setAddMentorDetails((prev) => ({
                                ...prev,
                                domain: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mentor-mode" className="text-sm">
                            Mode
                          </Label>
                          <Select
                            value={addMentorDetails.mode}
                            onValueChange={(value) =>
                              setAddMentorDetails((prev) => ({
                                ...prev,
                                mode: value,
                              }))
                            }
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ONLINE">Online</SelectItem>
                              <SelectItem value="OFFLINE">Offline</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter className="flex-col gap-2 sm:flex-row">
                        <DialogClose
                          className={"mr-2"}
                          onClick={() =>
                            setAddMentorDetails({
                              name: "",
                              domain: "",
                              mode: "ONLINE",
                            })
                          }
                        >
                          Cancel
                        </DialogClose>
                        <Button
                          className="w-full sm:w-auto"
                          onClick={handleAddMentor}
                        >
                          Add Mentor
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="mentorship-lock"
                      checked={mentorshipLocked}
                      onCheckedChange={handleToggleMentorshipLock}
                    />
                    <Label
                      htmlFor="mentorship-lock"
                      className="flex items-center gap-2 text-sm"
                    >
                      {mentorshipLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                      {mentorshipLocked ? "Locked" : "Unlocked"}
                    </Label>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mentor List</CardTitle>
                  <CardDescription className="text-sm">
                    Manage mentors and their availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mentors.map((mentor) => (
                      // Made mentor cards responsive with stacked layout on mobile
                      <div
                        key={mentor.id}
                        className="flex flex-col space-y-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
                      >
                        <div>
                          <h4 className="text-sm font-medium sm:text-base">
                            {mentor.user.username}
                          </h4>
                          <p className="text-xs text-slate-500 sm:text-sm">
                            {mentor.domains.join(",")} • {mentor.mode} •{" "}
                            {mentor.meetLink
                              ? `Meet Link: ${mentor.meetLink}`
                              : "No meet link provided"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              mentor.isAvailable ? "default" : "destructive"
                            }
                            className="text-xs"
                          >
                            {mentor.isAvailable ? "Available" : "Not available"}
                          </Badge>
                          <Badge variant={"outline"} className="text-xs">
                            Queue:{" "}
                            {
                              mentor.mentorshipQueue.filter(
                                (q) => q.status === "WAITING",
                              ).length
                            }
                            /5
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveMentor(mentor.id)}
                            className="text-xs"
                          >
                            <UserMinus className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                            Remove
                          </Button>
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
                            <DialogContent className="h-auto w-[95vw] max-w-md overflow-y-scroll">
                              <DialogHeader>
                                <DialogTitle className="text-lg">
                                  {mentor.user.username}&#39;s Queue Details
                                </DialogTitle>
                                <DialogDescription className="text-sm">
                                  Current teams in mentorship queue
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-2">
                                <div className="text-sm text-slate-600">
                                  {mentor.mentorshipQueue.length === 0
                                    ? "No teams in the queue."
                                    : mentor.mentorshipQueue.map((item) => (
                                        <div
                                          key={item.id}
                                          className="border-b pb-2"
                                        >
                                          <div className="flex w-full items-end justify-between gap-2">
                                            <p className="font-medium">
                                              Team: {item.team.name}
                                            </p>
                                            <Badge
                                              variant={
                                                item.status === "WAITING"
                                                  ? "yellow"
                                                  : item.status === "CANCELLED"
                                                    ? "red"
                                                    : item.status === "RESOLVED"
                                                      ? "green"
                                                      : "outline"
                                              }
                                              className="mt-1 text-xs"
                                            >
                                              {item.status}
                                            </Badge>
                                          </div>
                                          <p className="font-medium text-slate-500">
                                            {ago(item.createdAt)}
                                          </p>
                                          <p className="text-sm">
                                            Query: {item.query}
                                          </p>
                                          {item.notes && (
                                            <p className="text-sm italic">
                                              Notes: {item.notes}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="judgement">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Judge Management
                </h2>
                <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="round1-lock"
                      checked={round1Locked}
                      onCheckedChange={handleToggleRound1Lock}
                    />
                    <Label
                      htmlFor="round1-lock"
                      className="flex items-center gap-2 text-sm"
                    >
                      {round1Locked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                      Round 1 {round1Locked ? "Locked" : "Unlocked"}
                    </Label>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Judge
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-lg">
                          Add New Judge
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                          Add a new judge to the system
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="judge-name" className="text-sm">
                            Name
                          </Label>
                          <Input
                            id="judge-name"
                            placeholder="Prof. Jane Doe"
                            className="text-sm"
                            onInput={(e) =>
                              setAddJudgeDetails({
                                name: (e.target as HTMLInputElement).value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter className="flex-col gap-2 sm:flex-row">
                        <Button
                          variant="outline"
                          className="w-full bg-transparent sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button
                          className="w-full sm:w-auto"
                          onClick={handleAddJudge}
                        >
                          Add Judge
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Judges</CardTitle>
                  <CardDescription className="text-sm">
                    Manage judges and their assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[17rem] space-y-4 overflow-y-auto">
                    {judges.map((judge) => (
                      // Made judge cards responsive
                      <div
                        key={judge.id}
                        className="flex flex-col space-y-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
                      >
                        <div>
                          <h3 className="text-sm font-semibold sm:text-base">
                            {judge.user.username}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {judge.evaluations.length} teams assigned
                          </Badge>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleRemoveJudge(judge.id)}
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <TeamJudgeMapping teams={teams} judges={judges} />
            </div>
          </TabsContent>

          <TabsContent value="round2">
            <Round2RoomMapping teams={teams} judges={judges} />
          </TabsContent>

          <TabsContent value="teams">
            <TeamPage teams={teams} judges={judges} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementTab
              users={users}
              onUserUpdateAction={() => {
                // TODO Refresh users data
                console.log("Refreshing users data (todo)");
              }}
            />
          </TabsContent>

          <TabsContent value="logs">
            <ActivityLogs logs={logs} onRefreshAction={refreshLogs} />
          </TabsContent>

          <TabsContent value="announcements">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h2 className="text-xl font-bold sm:text-2xl">
                  Post Announcements
                </h2>
                <Dialog
                  open={isAnnouncementOpen}
                  onOpenChange={setIsAnnouncementOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      New Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-lg">
                        Create Announcement
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        Post a new announcement to all participants
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="announcement-title" className="text-sm">
                          Title
                        </Label>
                        <Input
                          id="announcement-title"
                          placeholder="Announcement title"
                          className="text-sm"
                          value={announcementTitle}
                          onChange={(e) => setAnnouncementTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="announcement-message"
                          className="text-sm"
                        >
                          Message
                        </Label>
                        <Textarea
                          id="announcement-message"
                          placeholder="Announcement message"
                          rows={4}
                          className="text-sm"
                          value={announcementDescription}
                          onChange={(e) =>
                            setAnnouncementDescription(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="w-full sm:w-auto"
                        onClick={handleAnnouncementPost}
                      >
                        Post Announcement
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Recent Announcements
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Manage and view all announcements
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
