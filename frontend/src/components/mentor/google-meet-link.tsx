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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Video } from "lucide-react";
import { apiService } from "@/lib/service";
import { useToast } from "@/hooks/use-toast";

export function GoogleMeetLink() {
  const [meetLink, setMeetLink] = useState("");
  const [savedLink, setSavedLink] = useState("");
  const { toast } = useToast();

  const handleSaveLink = async () => {
    try {
      await apiService.updateMeetLink(meetLink);
      setSavedLink(meetLink);
      toast({
        title: "Success",
        description: "Google Meet link saved successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save Google Meet link",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Google Meet Link
        </CardTitle>
        <CardDescription>
          Provide your Google Meet link for online mentoring sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="https://meet.google.com/..."
            value={meetLink}
            onChange={(e) => setMeetLink(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSaveLink}>Save Link</Button>
        </div>
        {savedLink && (
          <Alert>
            <Video className="h-4 w-4" />
            <AlertDescription>
              Meet link saved. Teams will be notified via WhatsApp group.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
