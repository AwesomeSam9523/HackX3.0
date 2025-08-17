"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { Trash2 } from "lucide-react"
import {
  Shield,
  Lock,
  Unlock,
  Users,
  UserPlus,
  UserMinus,
  Settings,
  FileText,
  Trophy,
  AlertTriangle,
} from "lucide-react"

// Add these imports at the top
import { ProblemStatementManagement } from "@/components/super-admin/problem-statement-management"
import { TeamJudgeMapping } from "@/components/super-admin/team-judge-mapping"
import { Round2RoomMapping } from "@/components/super-admin/round2-room-mapping"
import { ActivityLogs } from "@/components/super-admin/activity-logs"
import { UserManagementTab } from "@/components/super-admin/user-management-tab"
import { TeamPage } from "@/components/super-admin/team-page"

// Define the ProblemStatement type
type ProblemStatement = {
  id: string
  title: string
  description: string
  deliverables: string[]
  selectedCount: number
  domain: string
}

type Announcement = {
  id: number
  title: string
  message: string
  timestamp: string
  priority: string
}

export default function SuperAdminDashboard() {
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [psLocked, setPsLocked] = useState(false)
  const [mentorshipLocked, setMentorshipLocked] = useState(false)
  const [round1Locked, setRound1Locked] = useState(false)
  const [round2Locked, setRound2Locked] = useState(false)

  // Mock data
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: "2024-01-15 14:30:25",
      action: "Password Reset",
      user: "admin_john",
      target: "Team: Code Warriors",
      details: "Password reset for team login",
    },
    {
      id: 2,
      timestamp: "2024-01-15 14:25:10",
      action: "PS Selection",
      user: "team_codewarriors",
      target: "Smart Traffic Management System",
      details: "Problem statement selected",
    },
    {
      id: 3,
      timestamp: "2024-01-15 14:20:45",
      action: "Judge Scoring",
      user: "judge_michael",
      target: "Team: Tech Innovators",
      details: "Evaluation completed with score 8.5/10",
    },
  ])

  const [mentors, setMentors] = useState([
    {
      id: "m1",
      name: "Dr. Sarah Chen",
      domain: "AI/ML",
      mode: "Online",
      status: "Active",
    },
    {
      id: "m2",
      name: "Prof. Mike Johnson",
      domain: "Web Development",
      mode: "Offline",
      status: "Active",
    },
  ])

  const [judges, setJudges] = useState([
    {
      id: "j1",
      name: "Prof. Michael Johnson",
      floor: "Ground Floor",
      status: "Active",
      round: 1,
      teamsAssigned: 5,
    },
    {
      id: "j2",
      name: "Dr. Sarah Wilson",
      floor: "First Floor",
      status: "Active",
      round: 1,
      teamsAssigned: 3,
    },
  ])

  const [teams, setTeams] = useState([
    {
      id: "t1",
      teamName: "Code Warriors",
      round1Status: "Completed",
      round2Status: "Not Selected",
      round2Room: null,
      judgementStatus: "Completed",
    },
    {
      id: "t2",
      teamName: "Tech Innovators",
      round1Status: "Completed",
      round2Status: "Selected",
      round2Room: "AB2-301",
      judgementStatus: "Pending",
    },
  ])

  const [users, setUsers] = useState([
    { id: "u1", username: "team_codewarriors", type: "Team", status: "Active" },
    { id: "u2", username: "judge_michael", type: "Judge", status: "Active" },
    { id: "u3", username: "mentor_sarah", type: "Mentor", status: "Active" },
    { id: "u4", username: "admin_john", type: "Admin", status: "Active" },
  ])

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "Round 1 Evaluation Complete",
      message: "All teams have completed their Round 1 evaluations.",
      timestamp: "2024-01-15 14:30:25",
      priority: "high",
    },
    {
      id: 2,
      title: "Mentorship System Update",
      message: "The mentorship system has been updated with new features.",
      timestamp: "2024-01-15 14:25:10",
      priority: "medium",
    },
  ])

  // Add state for problem statements
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([
    {
      id: "ps1",
      title: "Smart Traffic Management System",
      description: "Develop an AI-powered traffic management system",
      deliverables: ["Working prototype", "Technical documentation"],
      selectedCount: 12,
      domain: "AI/ML",
    },
    {
      id: "ps2",
      title: "Healthcare Diagnosis Assistant",
      description: "Create an ML model for early disease detection",
      deliverables: ["Trained model", "Web interface"],
      selectedCount: 8,
      domain: "AI/ML",
    },
    {
      id: "ps3",
      title: "E-commerce Platform",
      description: "Build a full-stack e-commerce platform",
      deliverables: ["Full-stack application", "Database design"],
      selectedCount: 15,
      domain: "Web Development",
    },
  ])

  // Add refresh functions
  const refreshProblemStatements = async () => {
    try {
      // const data = await apiService.getDomains()
      // const allPS = data.flatMap(domain => domain.problemStatements)
      // setProblemStatements(allPS)
    } catch (error) {
      console.error("Failed to refresh problem statements:", error)
    }
  }

  const refreshLogs = async () => {
    try {
      // const data = await apiService.getLogs()
      // setLogs(data)
    } catch (error) {
      console.error("Failed to refresh logs:", error)
    }
  }

  const handleTogglePSLock = () => {
    setPsLocked(!psLocked)
    // Add log entry
    const newLog = {
      id: logs.length + 1,
      timestamp: new Date().toLocaleString(),
      action: psLocked ? "PS Unlocked" : "PS Locked",
      user: "super_admin",
      target: "Problem Statements",
      details: `Problem statement selection ${psLocked ? "unlocked" : "locked"}`,
    }
    setLogs((prev) => [newLog, ...prev])
  }

  const handleToggleMentorshipLock = () => {
    setMentorshipLocked(!mentorshipLocked)
    const newLog = {
      id: logs.length + 1,
      timestamp: new Date().toLocaleString(),
      action: mentorshipLocked ? "Mentorship Unlocked" : "Mentorship Locked",
      user: "super_admin",
      target: "Mentorship System",
      details: `Mentorship booking ${mentorshipLocked ? "unlocked" : "locked"}`,
    }
    setLogs((prev) => [newLog, ...prev])
  }

  const handleToggleRound1Lock = () => {
    setRound1Locked(!round1Locked)
    const newLog = {
      id: logs.length + 1,
      timestamp: new Date().toLocaleString(),
      action: round1Locked ? "Round 1 Unlocked" : "Round 1 Locked",
      user: "super_admin",
      target: "Round 1",
      details: `Round 1 evaluation ${round1Locked ? "unlocked" : "locked"}`,
    }
    setLogs((prev) => [newLog, ...prev])
  }

  const handleAddMentor = (mentorData: any) => {
    const newMentor = {
      id: `m${mentors.length + 1}`,
      ...mentorData,
      status: "Active",
    }
    setMentors((prev) => [...prev, newMentor])
  }

  const handleRemoveMentor = (mentorId: string) => {
    setMentors((prev) => prev.filter((m) => m.id !== mentorId))
  }

  const handleAddJudge = (judgeData: any) => {
    const newJudge = {
      id: `j${judges.length + 1}`,
      name: judgeData.name,
      floor: judgeData.floor,
      status: "Active",
      round: judgeData.round,
      teamsAssigned: 0,
    }
    setJudges((prev) => [...prev, newJudge])
  }

  const handleRemoveJudge = (judgeId: string) => {
    setJudges((prev) => prev.filter((judge) => judge.id !== judgeId))
  }

  const handlePromoteToRound2 = (teamIds: string[]) => {
    setTeams((prev) =>
      prev.map((team) =>
        teamIds.includes(team.id)
          ? { ...team, round2Status: "Selected", round2Room: `AB2-${Math.floor(Math.random() * 400) + 300}` }
          : team,
      ),
    )
  }

  const handleResetUserPassword = (userId: string) => {
    const newLog = {
      id: logs.length + 1,
      timestamp: new Date().toLocaleString(),
      action: "Password Reset",
      user: "super_admin",
      target: users.find((u) => u.id === userId)?.username || "Unknown",
      details: "Password reset by super admin",
    }
    setLogs((prev) => [newLog, ...prev])
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === "Active" ? "Disabled" : "Active" } : user,
      ),
    )
  }

  if (!passwordChanged) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-sm sm:max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg sm:text-xl">Change Password Required</CardTitle>
            <CardDescription className="text-sm">
              You must change your password before accessing the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm">
                Current Password
              </Label>
              <Input id="current-password" type="password" className="text-sm" />
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
              <Input id="confirm-password" type="password" className="text-sm" />
            </div>
            <Button className="w-full text-sm" onClick={() => setPasswordChanged(true)}>
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              Super Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">Complete system control and monitoring</p>
          </div>
          <Alert className="w-full sm:w-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">Super Admin privileges active</AlertDescription>
          </Alert>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-max sm:w-full grid-cols-9 min-w-[800px] sm:min-w-0">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="problem-statements" className="text-xs sm:text-sm">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Problem Statements</span>
                    <Badge variant={psLocked ? "destructive" : "default"} className="text-xs">
                      {psLocked ? "Locked" : "Open"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Mentorship</span>
                    <Badge variant={mentorshipLocked ? "destructive" : "default"} className="text-xs">
                      {mentorshipLocked ? "Locked" : "Open"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Round 1</span>
                    <Badge variant={round1Locked ? "destructive" : "default"} className="text-xs">
                      {round1Locked ? "Locked" : "Open"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Round 2</span>
                    <Badge variant={round2Locked ? "destructive" : "default"} className="text-xs">
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
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {users.filter((u) => u.status === "Active").length}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500">Total active users</p>
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
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">
                    {teams.filter((t) => t.round2Status === "Selected").length}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500">Promoted to Round 2</p>
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
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600">{logs.length}</div>
                  <p className="text-xs sm:text-sm text-slate-500">Total log entries</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="problem-statements">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold">Problem Statement Management</h2>
                <div className="flex items-center space-x-2">
                  <Switch id="ps-lock" checked={psLocked} onCheckedChange={handleTogglePSLock} />
                  <Label htmlFor="ps-lock" className="flex items-center gap-2 text-sm">
                    {psLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    {psLocked ? "Locked" : "Unlocked"}
                  </Label>
                </div>
              </div>
              <ProblemStatementManagement problemStatements={problemStatements} onUpdate={refreshProblemStatements} />
            </div>
          </TabsContent>

          <TabsContent value="mentorship">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl sm:text-2xl font-bold">Mentorship Management</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Mentor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-lg">Add New Mentor</DialogTitle>
                        <DialogDescription className="text-sm">Add a new mentor to the system</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="mentor-name" className="text-sm">
                            Name
                          </Label>
                          <Input id="mentor-name" placeholder="Dr. John Smith" className="text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mentor-domain" className="text-sm">
                            Domain
                          </Label>
                          <Select>
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select domain" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ai-ml">AI/ML</SelectItem>
                              <SelectItem value="web-dev">Web Development</SelectItem>
                              <SelectItem value="mobile">Mobile Development</SelectItem>
                              <SelectItem value="blockchain">Blockchain</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mentor-mode" className="text-sm">
                            Mode
                          </Label>
                          <Select>
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="online">Online</SelectItem>
                              <SelectItem value="offline">Offline</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                          Cancel
                        </Button>
                        <Button className="w-full sm:w-auto">Add Mentor</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="mentorship-lock"
                      checked={mentorshipLocked}
                      onCheckedChange={handleToggleMentorshipLock}
                    />
                    <Label htmlFor="mentorship-lock" className="flex items-center gap-2 text-sm">
                      {mentorshipLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      {mentorshipLocked ? "Locked" : "Unlocked"}
                    </Label>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mentor List</CardTitle>
                  <CardDescription className="text-sm">Manage mentors and their availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mentors.map((mentor) => (
                      // Made mentor cards responsive with stacked layout on mobile
                      <div
                        key={mentor.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0"
                      >
                        <div>
                          <h4 className="font-medium text-sm sm:text-base">{mentor.name}</h4>
                          <p className="text-xs sm:text-sm text-slate-500">
                            {mentor.domain} • {mentor.mode}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={mentor.status === "Active" ? "default" : "secondary"} className="text-xs">
                            {mentor.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveMentor(mentor.id)}
                            className="text-xs"
                          >
                            <UserMinus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Remove
                          </Button>
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
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl sm:text-2xl font-bold">Judge Management</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="round1-lock" checked={round1Locked} onCheckedChange={handleToggleRound1Lock} />
                    <Label htmlFor="round1-lock" className="flex items-center gap-2 text-sm">
                      {round1Locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      Round 1 {round1Locked ? "Locked" : "Unlocked"}
                    </Label>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Judge
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-lg">Add New Judge</DialogTitle>
                        <DialogDescription className="text-sm">Add a new judge to the system</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="judge-name" className="text-sm">
                            Name
                          </Label>
                          <Input id="judge-name" placeholder="Prof. Jane Doe" className="text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="judge-round" className="text-sm">
                            Round
                          </Label>
                          <Select>
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select round" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Round 1</SelectItem>
                              <SelectItem value="2">Round 2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                          Cancel
                        </Button>
                        <Button className="w-full sm:w-auto">Add Judge</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Judges</CardTitle>
                  <CardDescription className="text-sm">Manage judges and their assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {judges.map((judge) => (
                      // Made judge cards responsive
                      <div
                        key={judge.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0"
                      >
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">{judge.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">Round {judge.round}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {judge.teamsAssigned} teams
                          </Badge>
                          <Button variant="destructive" size="sm" className="text-xs">
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
            <TeamPage teams={teams} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementTab
              users={users}
              onUserUpdate={() => {
                // Refresh users data
                console.log("Refreshing users data")
              }}
            />
          </TabsContent>

          <TabsContent value="logs">
            <ActivityLogs logs={logs} onRefresh={refreshLogs} />
          </TabsContent>

          <TabsContent value="announcements">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold">Post Announcements</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      New Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-lg">Create Announcement</DialogTitle>
                      <DialogDescription className="text-sm">
                        Post a new announcement to all participants
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="announcement-title" className="text-sm">
                          Title
                        </Label>
                        <Input id="announcement-title" placeholder="Announcement title" className="text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="announcement-message" className="text-sm">
                          Message
                        </Label>
                        <Textarea
                          id="announcement-message"
                          placeholder="Announcement message"
                          rows={4}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="announcement-priority" className="text-sm">
                          Priority
                        </Label>
                        <Select>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                        Cancel
                      </Button>
                      <Button className="w-full sm:w-auto">Post Announcement</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Announcements</CardTitle>
                  <CardDescription className="text-sm">Manage and view all announcements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      // Made announcement cards responsive
                      <div key={announcement.id} className="p-4 border rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                          <h4 className="font-medium text-sm sm:text-base">{announcement.title}</h4>
                          <Badge variant="outline" className="text-xs w-fit">
                            {announcement.timestamp}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">{announcement.message}</p>
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
  )
}
