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
import type { Mentor, MentorshipSession } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MentorshipProps {
  mentors: Mentor[];
  mentorshipSession: MentorshipSession | null;
  onSelectMentorAction: (mentorId: MentorshipSession | null) => void;
  refreshMentorsAction: () => void;
}

export function Mentorship({
  mentors,
  mentorshipSession,
  onSelectMentorAction,
  refreshMentorsAction,
}: MentorshipProps) {
  const [domainFilter, setDomainFilter] = useState("all");
  const [mentorSearch, setMentorSearch] = useState("");
  const [showOnline, setShowOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [activeMentorId, setActiveMentorId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const filteredMentors = mentors.filter((mentor) => {
    // const matchesDomain =
    //   domainFilter === "all" ||
    //   mentor.domain.toLowerCase().includes(domainFilter.replace("-", "/"));
    const matchesSearch = mentor.user.username
      .toLowerCase()
      .includes(mentorSearch.toLowerCase());
    const matchesMode =
      (showOnline && mentor.mode === "ONLINE") ||
      (showOffline && mentor.mode === "IN_PERSON");
    return matchesSearch && matchesMode;
  });

  const handleBookMentor = async (mentorId: string) => {
    try {
      const session = await apiService.bookMentor(mentorId, query);
      onSelectMentorAction(session);
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

  const handleCancelMentor = async () => {
    await apiService.cancelMentorBooking(mentorshipSession!.id);
    onSelectMentorAction(null);
    setShowCancelDialog(false);
    toast({
      title: "Cancelled",
      description: "Mentor selection cancelled",
    });
  };

  useEffect(() => {
    const interval = setInterval(refreshMentorsAction, 10000);
    return () => clearInterval(interval);
  }, [refreshMentorsAction]);

  if (mentorshipSession) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{mentorshipSession.mentor.user.username}</CardTitle>
          <CardDescription>
            {mentorshipSession.mentor.domains.join(", ")} • Mentorship Mode:{" "}
            {mentorshipSession.mentor.mode}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="">
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <p className="mb-4">
                <strong>Query:</strong> {mentorshipSession.query}
              </p>
              <DialogTrigger asChild>
                <Button variant="destructive">Cancel Booking</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Mentor Booking?</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to cancel your mentor booking?</p>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog(false)}
                  >
                    No
                  </Button>
                  <Button variant="destructive" onClick={handleCancelMentor}>
                    Yes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mentor Booking</h2>
        <Button variant="outline" size="sm" disabled={true}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Auto refresh (10s)
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-col items-center gap-2 md:flex-row md:gap-4">
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
            <div className="w-full space-y-2">
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

      <div className="grid grid-cols-3 gap-4">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{mentor.user.username}</CardTitle>
                  <CardDescription>
                    {mentor.domains.join(", ")} • Mode: {mentor.mode}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      mentor.mentorshipQueue.length >= 5
                        ? "destructive"
                        : "default"
                    }
                  >
                    {mentor.waitingTeamsCount}/{5} slots
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <Dialog
              open={activeMentorId === mentor.id}
              onOpenChange={(open) =>
                setActiveMentorId(open ? mentor.id : null)
              }
            >
              <DialogTrigger asChild>
                <Button
                  className="mx-5"
                  disabled={mentor.mentorshipQueue.length >= 5}
                >
                  {mentor.mentorshipQueue.length >= 5
                    ? "Queue Full"
                    : "Book Mentor"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Book {mentor.user.username} for mentorship session
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`query-${mentor.id}`}>Your Query</Label>
                    <Input
                      id={`query-${mentor.id}`}
                      placeholder="Describe what you want to discuss..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setActiveMentorId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      handleBookMentor(mentor.id);
                      setActiveMentorId(null);
                    }}
                    disabled={!query.trim()}
                  >
                    Confirm Booking
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        ))}
      </div>
    </div>
  );
}
