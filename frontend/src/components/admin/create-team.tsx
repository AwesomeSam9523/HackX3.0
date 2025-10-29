"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Minus, Plus } from "lucide-react";
import { apiService } from "@/lib/service";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  name: string;
  email: string;
  phone: string;
}

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated: () => void;
}

export function CreateTeamModal({
  isOpen,
  onClose,
  onTeamCreated,
}: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState("");
  const [teamLeader, setTeamLeader] = useState<TeamMember>({
    name: "",
    email: "",
    phone: "",
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "", email: "", phone: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [createdTeam, setCreatedTeam] = useState<{
    teamId: string;
  } | null>(null);

  const { toast } = useToast();

  function isTeamValid() {
    if (!teamName.trim()) return false;
    let count = 0;
    if (
      !teamLeader.name.trim() ||
      !teamLeader.email.trim() ||
      !teamLeader.phone.trim()
    )
      return false;
    count++;
    for (const member of teamMembers) {
      if (!member.name.trim() || !member.email.trim() || !member.phone.trim())
        return false;
      count++;
    }

    return count >= 2 && count <= 4;
  }

  const addTeamMember = () => {
    console.log(teamMembers);
    console.log(teamMembers.length);
    if (teamMembers.length < 3) {
      setTeamMembers([...teamMembers, { name: "", email: "", phone: "" }]);
    }
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      const newMembers = teamMembers.filter((_, i) => i !== index);
      setTeamMembers(newMembers);
    }
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMember,
    value: string,
  ) => {
    const newMembers = [...teamMembers];
    newMembers[index][field] = value;
    setTeamMembers(newMembers);
    console.log(newMembers);
  };

  const updateTeamLeader = (field: keyof TeamMember, value: string) => {
    setTeamLeader({ ...teamLeader, [field]: value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!teamName.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }

    if (!teamLeader.name.trim() || !teamLeader.email.trim()) {
      toast({
        title: "Error",
        description: "Team leader name and email are required",
        variant: "destructive",
      });
      return;
    }

    // Validate team members (at least name and email for non-empty entries)
    const validMembers = teamMembers.filter(
      (member) => member.name.trim() || member.email.trim(),
    );
    const invalidMembers = validMembers.some(
      (member) => !member.name.trim() || !member.email.trim(),
    );

    if (invalidMembers) {
      toast({
        title: "Error",
        description: "All team members must have at least name and email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiService.createTeam({
        teamName: teamName.trim(),
        teamLeader: {
          name: teamLeader.name.trim(),
          email: teamLeader.email.trim(),
          phone: teamLeader.phone.trim() || undefined,
        },
        teamMembers: validMembers.map((member) => ({
          name: member.name.trim(),
          email: member.email.trim(),
          phone: member.phone.trim() || undefined,
        })),
      });

      setCreatedTeam(result.team);

      toast({
        title: "Success!",
        description: `Team "${teamName}" created successfully`,
      });

      onTeamCreated();
    } catch (error) {
      console.error("Failed to create team:", error);
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setTeamName("");
    setTeamLeader({ name: "", email: "", phone: "" });
    setTeamMembers([{ name: "", email: "", phone: "" }]);
    setCreatedTeam(null);
    onClose();
  };

  const handleNewTeam = () => {
    setCreatedTeam(null);
    setTeamName("");
    setTeamLeader({ name: "", email: "", phone: "" });
    setTeamMembers([{ name: "", email: "", phone: "" }]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {createdTeam ? "Team Created Successfully!" : "Create New Team"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {createdTeam ? "" : "Add team details and participant information"}
          </DialogDescription>
        </DialogHeader>

        {createdTeam ? (
          // Success View
          <div className="space-y-6">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium text-green-800">
                  Team Created!
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-green-700">
                    Team ID
                  </Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded-md border bg-white px-3 py-2 font-mono text-sm">
                      {createdTeam.teamId}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Form View
          <div className="space-y-6">
            {/* Team Name */}
            <div className="space-y-2">
              <Label
                htmlFor="team-name"
                className="relative w-fit text-sm font-medium"
              >
                Team Name
                <span className={"absolute -right-2 text-red-500"}>*</span>
              </Label>
              <Input
                id="team-name"
                placeholder="Enter team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Team Leader */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label className="relative text-sm font-medium">
                  Team Leader
                  <span className={"absolute -right-2 text-red-500"}>*</span>
                </Label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-600">Name</Label>
                  <Input
                    placeholder="Leader name"
                    value={teamLeader.name}
                    onChange={(e) => updateTeamLeader("name", e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-600">Email</Label>
                  <Input
                    type="email"
                    placeholder="leader@example.com"
                    value={teamLeader.email}
                    onChange={(e) => updateTeamLeader("email", e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-600">Phone</Label>
                <Input
                  placeholder="Phone number"
                  value={teamLeader.phone}
                  onChange={(e) => updateTeamLeader("phone", e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Team Members</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addTeamMember}
                  disabled={teamMembers.length >= 3}
                  className="text-xs"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Member
                </Button>
              </div>

              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="space-y-3 rounded-lg border bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      Member {index + 1}
                    </Badge>
                    {teamMembers.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeTeamMember(index)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-600">Name</Label>
                      <Input
                        placeholder="Member name"
                        value={member.name}
                        onChange={(e) =>
                          updateTeamMember(index, "name", e.target.value)
                        }
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-600">Email</Label>
                      <Input
                        type="email"
                        placeholder="member@example.com"
                        value={member.email}
                        onChange={(e) =>
                          updateTeamMember(index, "email", e.target.value)
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">
                      Phone (Optional)
                    </Label>
                    <Input
                      placeholder="Phone number"
                      value={member.phone}
                      onChange={(e) =>
                        updateTeamMember(index, "phone", e.target.value)
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {createdTeam ? (
            <>
              <Button
                variant="outline"
                onClick={handleNewTeam}
                className="w-full sm:w-auto"
              >
                Create Another Team
              </Button>
              <Button onClick={handleClose} className="w-full sm:w-auto">
                Done
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !isTeamValid()}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Creating..." : "Create Team"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
