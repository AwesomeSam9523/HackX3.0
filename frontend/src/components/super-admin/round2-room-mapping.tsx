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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, UserCheck, Users } from "lucide-react";
import { apiService } from "@/lib/service";
import { useToast } from "@/hooks/use-toast";
import type { Judge, Round2Room, Team } from "@/lib/types";

interface Round2RoomMappingProps {
  teams: Team[];
  judges: Judge[];
}

export function Round2RoomMapping({ teams, judges }: Round2RoomMappingProps) {
  const [rooms, setRooms] = useState<Round2Room[]>([]);
  const [selectedJudge, setSelectedJudge] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedRoomForTeam, setSelectedRoomForTeam] = useState<string>("");
  const [isJudgeMapOpen, setIsJudgeMapOpen] = useState(false);
  const [isTeamAssignOpen, setIsTeamAssignOpen] = useState(false);
  const { toast } = useToast();

  // Mock Round 2 rooms data - in real app, this would come from API
  useEffect(() => {
    const mockRooms: Round2Room[] = [
      {
        id: "r1",
        roomNumber: "AB2-301",
        floor: "Third Floor",
        capacity: 1,
        assignedTeams: [],
      },
      {
        id: "r2",
        roomNumber: "AB2-302",
        floor: "Third Floor",
        capacity: 1,
        assignedTeams: [],
      },
      {
        id: "r3",
        roomNumber: "AB2-303",
        floor: "Third Floor",
        capacity: 1,
        assignedTeams: [],
      },
      {
        id: "r4",
        roomNumber: "AB2-304",
        floor: "Third Floor",
        capacity: 1,
        assignedTeams: [],
      },
      {
        id: "r5",
        roomNumber: "AB2-305",
        floor: "Third Floor",
        capacity: 1,
        assignedTeams: [],
      },
      {
        id: "r6",
        roomNumber: "AB2-306",
        floor: "Third Floor",
        capacity: 1,
        assignedTeams: [],
      },
    ];
    setRooms(mockRooms);
  }, []);

  const handleMapJudgeToRoom = async () => {
    if (!selectedJudge || !selectedRoom) return;

    try {
      await apiService.mapJudgeToRoom(selectedJudge, selectedRoom);

      // Update local state
      setRooms((prev) =>
        prev.map((room) =>
          room.id === selectedRoom
            ? { ...room, assignedJudge: selectedJudge }
            : room,
        ),
      );

      toast({
        title: "Success",
        description: "Judge mapped to room successfully",
      });
      setIsJudgeMapOpen(false);
      setSelectedJudge("");
      setSelectedRoom("");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to map judge to room",
        variant: "destructive",
      });
    }
  };

  const handleAssignTeamToRoom = async () => {
    if (!selectedTeam || !selectedRoomForTeam) return;

    try {
      await apiService.assignTeamToRoom(selectedTeam, selectedRoomForTeam);

      // Update local state
      setRooms((prev) =>
        prev.map((room) =>
          room.id === selectedRoomForTeam
            ? { ...room, assignedTeams: [...room.assignedTeams, selectedTeam] }
            : room,
        ),
      );

      toast({
        title: "Success",
        description: "Team assigned to room successfully",
      });
      setIsTeamAssignOpen(false);
      setSelectedTeam("");
      setSelectedRoomForTeam("");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to assign team to room",
        variant: "destructive",
      });
    }
  };

  const getJudgeName = (judgeId: string) => {
    return judges.find((j) => j.id === judgeId)?.name || "Unknown Judge";
  };

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || "Unknown Team";
  };

  const round2Teams = teams.filter((team) => team.round2Status === "Selected");
  const availableJudges = judges.filter(
    (judge) => !rooms.some((room) => room.assignedJudge === judge.id),
  );
  const availableRooms = rooms.filter((room) => !room.assignedJudge);
  const availableTeams = round2Teams.filter(
    (team) => !rooms.some((room) => room.assignedTeams.includes(team.id)),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Round 2 Room Management</h2>
        <div className="flex gap-2">
          <Dialog open={isJudgeMapOpen} onOpenChange={setIsJudgeMapOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserCheck className="mr-2 h-4 w-4" />
                Map Judges to Rooms
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Map Judge to Room</DialogTitle>
                <DialogDescription>
                  Assign judges to Round 2 evaluation rooms
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Judge</label>
                  <Select
                    value={selectedJudge}
                    onValueChange={setSelectedJudge}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a judge" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableJudges.map((judge) => (
                        <SelectItem key={judge.id} value={judge.id}>
                          {judge.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Room</label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.roomNumber} - {room.floor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsJudgeMapOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleMapJudgeToRoom}>Map Judge</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isTeamAssignOpen} onOpenChange={setIsTeamAssignOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Assign Teams
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Team to Room</DialogTitle>
                <DialogDescription>
                  Assign Round 2 teams to evaluation rooms
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Team</label>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Room</label>
                  <Select
                    value={selectedRoomForTeam}
                    onValueChange={setSelectedRoomForTeam}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms
                        .filter(
                          (room) =>
                            room.assignedJudge &&
                            room.assignedTeams.length < room.capacity,
                        )
                        .map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.roomNumber} - Judge:{" "}
                            {getJudgeName(room.assignedJudge!)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsTeamAssignOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAssignTeamToRoom}>Assign Team</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className={`border-l-4 ${room.assignedJudge ? "border-l-green-500" : "border-l-gray-300"}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{room.roomNumber}</CardTitle>
                  <CardDescription>{room.floor}</CardDescription>
                </div>
                <Badge variant={room.assignedJudge ? "default" : "secondary"}>
                  {room.assignedJudge ? "Assigned" : "Available"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {room.assignedJudge ? (
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">
                        Judge: {getJudgeName(room.assignedJudge)}
                      </span>
                    </div>

                    {room.assignedTeams.length > 0 ? (
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            Assigned Teams:
                          </span>
                        </div>
                        {room.assignedTeams.map((teamId) => (
                          <Badge
                            key={teamId}
                            variant="outline"
                            className="mr-1 mb-1"
                          >
                            {getTeamName(teamId)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500">
                        No teams assigned yet
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">
                    <MapPin className="mr-1 inline h-4 w-4" />
                    Waiting for judge assignment
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Summary</CardTitle>
          <CardDescription>
            Overview of Round 2 room assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {rooms.filter((r) => r.assignedJudge).length}/{rooms.length}
              </div>
              <p className="text-sm text-slate-500">Rooms with Judges</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {rooms.reduce(
                  (sum, room) => sum + room.assignedTeams.length,
                  0,
                )}
              </div>
              <p className="text-sm text-slate-500">Teams Assigned</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {availableTeams.length}
              </div>
              <p className="text-sm text-slate-500">Teams Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
