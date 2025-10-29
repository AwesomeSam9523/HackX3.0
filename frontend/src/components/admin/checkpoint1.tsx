"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, UserCheck, Users } from "lucide-react";
import { apiService } from "@/lib/service";
import {
  Checkpoint,
  Checkpoint1UpdateData,
  Participant,
  TeamCheckpoint1Data,
} from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface Checkpoint1ModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
  onComplete: (checkpoint: Checkpoint) => void;
}

export function Checkpoint1Modal({
  isOpen,
  onClose,
  teamId,
  teamName,
  onComplete,
}: Checkpoint1ModalProps) {
  const [teamData, setTeamData] = useState<TeamCheckpoint1Data | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [wifi, setWifi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    email: "",
    phone: "",
    role: "MEMBER" as "MEMBER" | "LEADER",
  });
  const { toast } = useToast();

  const loadTeamData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getTeamForCheckpoint1(teamId);
      setTeamData(data);
      setParticipants(data.participants);
      setWifi(data.wifi);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load team data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [teamId, toast]);

  // Load team data when modal opens
  useEffect(() => {
    if (isOpen && teamId) {
      loadTeamData();
    }
  }, [isOpen, teamId, loadTeamData]);

  const handleParticipantChange = (
    index: number,
    field: keyof Participant,
    value: string | boolean,
  ) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  const addParticipant = () => {
    if (!newParticipant.name || !newParticipant.email) {
      toast({
        title: "Error",
        description: "Please fill in name and email",
        variant: "destructive",
      });
      return;
    }

    // Check if trying to add a team leader when one already exists
    if (newParticipant.role === "LEADER") {
      const existingLeader = participants.find((p) => p.role === "LEADER");
      if (existingLeader) {
        toast({
          title: "Error",
          description: "Only one team leader is allowed per team",
          variant: "destructive",
        });
        return;
      }
    }

    // Add participant to local state only
    const newParticipantWithId = {
      ...newParticipant,
      id: `temp-${Date.now()}`, // Temporary ID for local state
      isPresent: false,
    };

    setParticipants([...participants, newParticipantWithId]);
    setNewParticipant({ name: "", email: "", phone: "", role: "MEMBER" });

    toast({
      title: "Success",
      description:
        "Participant added (will be saved when checkpoint is completed)",
    });
  };

  const removeParticipant = (index: number) => {
    const updatedParticipants = participants.filter((_, i) => i !== index);
    setParticipants(updatedParticipants);

    toast({
      title: "Success",
      description:
        "Participant removed (will be saved when checkpoint is completed)",
    });
  };

  const togglePresence = (participantIndex: number, isPresent: boolean) => {
    const updatedParticipants = [...participants];
    updatedParticipants[participantIndex] = {
      ...updatedParticipants[participantIndex],
      isPresent,
    };
    setParticipants(updatedParticipants);
  };

  const handleComplete = async () => {
    const presentParticipants = participants.filter((p) => p.isPresent);
    if (presentParticipants.length < 2) {
      toast({
        title: "Error",
        description:
          "At least 2 participants must be marked as present to complete checkpoint 1",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const updateData: Checkpoint1UpdateData = {
        teamId,
        wifi,
        participants,
      };

      const result = (await apiService.updateCheckpoint(
        1,
        updateData,
      )) as Checkpoint;
      onComplete(result);
      onClose();
      toast({
        title: "Success",
        description: "Checkpoint 1 completed successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to complete checkpoint 1",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const presentCount = participants.filter((p) => p.isPresent).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="m-auto flex h-[90vh] max-h-none w-[60vw] !max-w-none flex-col p-6">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6" />
            Checkpoint 1 - {teamName}
            {teamData?.status && teamData.status !== "pending" && (
              <Badge
                variant={
                  teamData.status === "COMPLETED" ? "default" : "outline"
                }
                className={`text-sm ${
                  teamData.status === "PARTIALLY_COMPLETED"
                    ? "border-orange-500 text-orange-600"
                    : ""
                }`}
              >
                {teamData.status === "COMPLETED"
                  ? "Complete"
                  : teamData.status === "PARTIALLY_COMPLETED"
                    ? "Partially Filled"
                    : teamData.status}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-base">
            Team details confirmation, participant management, and WiFi opt-in
            {teamData?.status === "PARTIALLY_COMPLETED" && (
              <span className="mt-1 block font-medium text-orange-600">
                ⚠ This checkpoint was previously completed with partial
                attendance
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-lg text-gray-500">Loading team data...</div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
            {/* Team Summary */}
            <Card className="flex-shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserCheck className="h-5 w-5" />
                  Team Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Team Name:
                    </Label>
                    <p className="mt-1 text-base font-semibold">{teamName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Team ID:
                    </Label>
                    <p className="mt-1 font-mono text-base font-semibold">
                      {teamData?.teamId}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Total Participants:
                    </Label>
                    <p className="mt-1 text-base font-semibold">
                      {participants.length}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Present:
                    </Label>
                    <Badge
                      variant={presentCount > 0 ? "default" : "secondary"}
                      className="mt-1 w-fit px-3 py-1 text-sm"
                    >
                      {presentCount} present
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants Management */}
            <Card className="min-h-0 flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Participants Management
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 space-y-4 overflow-y-auto">
                {/* Existing Participants */}
                <div className="space-y-3">
                  {participants.map((participant, index) => (
                    <div
                      key={participant.id || `temp-${index}`}
                      className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={participant.isPresent || false}
                          onCheckedChange={(checked) =>
                            togglePresence(index, checked)
                          }
                          className="scale-90"
                        />
                        <Label className="text-sm font-medium">Present</Label>
                      </div>

                      <div className="flex flex-1 flex-row gap-2">
                        <Input
                          placeholder="Name"
                          value={participant.name}
                          onChange={(e) =>
                            handleParticipantChange(
                              index,
                              "name",
                              e.target.value,
                            )
                          }
                          className="h-9 text-sm"
                        />
                        <Input
                          placeholder="Email"
                          value={participant.email}
                          onChange={(e) =>
                            handleParticipantChange(
                              index,
                              "email",
                              e.target.value,
                            )
                          }
                          className="h-9 text-sm"
                        />
                        <Input
                          placeholder="Phone (optional)"
                          value={participant.phone || ""}
                          onChange={(e) =>
                            handleParticipantChange(
                              index,
                              "phone",
                              e.target.value,
                            )
                          }
                          className="h-9 text-sm"
                        />
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeParticipant(index)}
                        className="h-9 w-9 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add New Participant */}
                <div className="border-t pt-4">
                  <Label className="mb-3 block text-sm font-semibold">
                    Add New Participant
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Name"
                        value={newParticipant.name}
                        onChange={(e) =>
                          setNewParticipant({
                            ...newParticipant,
                            name: e.target.value,
                          })
                        }
                        className="h-9 flex-1 text-sm"
                      />
                      <Input
                        placeholder="Email"
                        value={newParticipant.email}
                        onChange={(e) =>
                          setNewParticipant({
                            ...newParticipant,
                            email: e.target.value,
                          })
                        }
                        className="h-9 flex-1 text-sm"
                      />
                      <Input
                        placeholder="Phone"
                        value={newParticipant.phone}
                        onChange={(e) =>
                          setNewParticipant({
                            ...newParticipant,
                            phone: e.target.value,
                          })
                        }
                        className="h-9 flex-1 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium whitespace-nowrap">
                        Role:
                      </Label>
                      <Select
                        value={newParticipant.role}
                        onValueChange={(value: "MEMBER" | "LEADER") =>
                          setNewParticipant({ ...newParticipant, role: value })
                        }
                      >
                        <SelectTrigger className="h-9 flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MEMBER">Member</SelectItem>
                          <SelectItem
                            value="LEADER"
                            disabled={participants.some(
                              (p) => p.role === "LEADER",
                            )}
                          >
                            Team Leader{" "}
                            {participants.some((p) => p.role === "LEADER")
                              ? "(Already assigned)"
                              : ""}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={addParticipant}
                        className="h-9 px-3 text-sm"
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WiFi Opt-in */}
            <Card className="flex-shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">WiFi Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 rounded-lg bg-blue-50 p-3">
                  <Switch
                    checked={wifi}
                    onCheckedChange={setWifi}
                    className="scale-110"
                  />
                  <Label className="text-sm font-medium">WiFi Opt-in</Label>
                </div>
                <p className="mt-2 text-xs text-gray-600">
                  Enable if the team wants access to WiFi during the hackathon
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className="flex gap-3 bg-white pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-9 flex-1 text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={loading || presentCount < 2}
            className={`${presentCount < participants.length ? "bg-yellow-600 text-black hover:bg-yellow-700" : "bg-green-600 text-white hover:bg-green-700"} h-9 flex-1 text-sm`}
          >
            {loading
              ? "Processing..."
              : presentCount < participants.length
                ? "Partially Complete"
                : "Complete Checkpoint 1"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
