"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { apiService } from "@/lib/service";
import { useToast } from "@/hooks/use-toast";
import type { Mentor } from "@/lib/types";

interface MentorshipProps {
  mentors: Mentor[];
  selectedMentor: string | null;
  onSelectMentor: (mentorId: string) => void;
}

export function Mentorship({
  mentors,
  selectedMentor,
  onSelectMentor,
}: MentorshipProps) {
  const [domainFilter, setDomainFilter] = useState("all");
  const [mentorSearch, setMentorSearch] = useState("");
  const [showOnline, setShowOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(true);
  const { toast } = useToast();

  const filteredMentors = mentors.filter((mentor) => {
    const matchesDomain =
      domainFilter === "all" ||
      mentor.domain.toLowerCase().includes(domainFilter.replace("-", "/"));
    const matchesSearch = mentor.user.username
      .toLowerCase()
      .includes(mentorSearch.toLowerCase());
    const matchesMode =
      (showOnline && mentor.mode === "ONLINE") ||
      (showOffline && mentor.mode === "IN_PERSON");
    return matchesDomain && matchesSearch && matchesMode;
  });

  const handleBookMentor = async (mentorId: string) => {
    try {
      await apiService.bookMentor(mentorId);
      onSelectMentor(mentorId);
      toast({
        title: "Success",
        description: "Mentor booked successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to book mentor",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mentor Booking</h2>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh (10s)
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="domain-filter">Domain</Label>
              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Domains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Domains</SelectItem>
                  <SelectItem value="ai-ml">AI/ML</SelectItem>
                  <SelectItem value="web-dev">Web Development</SelectItem>
                  <SelectItem value="mobile">Mobile Development</SelectItem>
                  <SelectItem value="blockchain">Blockchain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mentor-search">Search Mentor</Label>
              <Input
                id="mentor-search"
                placeholder="Search by name..."
                value={mentorSearch}
                onChange={(e) => setMentorSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Mode</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-online"
                    checked={showOnline}
                    onCheckedChange={setShowOnline}
                  />
                  <Label htmlFor="show-online">Online</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-offline"
                    checked={showOffline}
                    onCheckedChange={setShowOffline}
                  />
                  <Label htmlFor="show-offline">Offline</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{mentor.user.username}</CardTitle>
                  <CardDescription>
                    {mentor.domain} • {mentor.mode}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      mentor.queueCount >= 5
                        ? "destructive"
                        : "default"
                    }
                  >
                    {mentor.queueCount}/{5} slots
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                disabled={mentor.queueCount >= 5}
                onClick={() => handleBookMentor(mentor.id)}
              >
                {mentor.queueCount >= 5
                  ? "Queue Full"
                  : "Book Mentor"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
