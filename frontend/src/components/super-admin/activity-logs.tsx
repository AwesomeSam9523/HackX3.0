"use client";

import { useCallback, useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileText, Filter, RefreshCw, Search } from "lucide-react";
import { apiService } from "@/lib/service";
import { useToast } from "@/hooks/use-toast";
import type { LogEntry, LogFilter } from "@/lib/types";

interface ActivityLogsProps {
  logs: LogEntry[];
  onRefreshAction: () => void;
}

export function ActivityLogs({
  logs: initialLogs,
  onRefreshAction,
}: ActivityLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(initialLogs);
  const [filters, setFilters] = useState<LogFilter>({
    action: "all",
    user: "all",
    search: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get unique actions and users for filter dropdowns
  const actions = Array.from(new Set(logs.map((log) => log.action)));
  const uniqueActions = actions.sort((a, b) => a.localeCompare(b));
  const uniqueUsers = Array.from(
    new Set(logs.map((log) => log.user?.username)),
  ).filter((log) => log);

  useEffect(() => {
    setLogs(initialLogs);
    setFilteredLogs(initialLogs);
  }, [initialLogs]);

  const applyFilters = useCallback(async () => {
    setIsLoading(true);
    try {
      const hasFilters = Object.values(filters).some(
        (value) => value && value.trim() !== "",
      );

      if (hasFilters) {
        const filteredData = await apiService.getFilteredLogs(filters);
        setFilteredLogs(filteredData);
      } else {
        setFilteredLogs(logs);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to filter logs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, logs, toast]);

  useEffect(() => {
    applyFilters().then();
  }, [filters, logs, applyFilters]);

  const handleFilterChange = (key: keyof LogFilter, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      action: "all",
      user: "all",
      search: "",
    });
  };

  const exportLogs = () => {
    const csvContent = [
      ["Timestamp", "Action", "Username", "Role"].join(","),
      ...filteredLogs.map((log) =>
        [log.createdAt, log.action, log.user?.username, log.user?.role].join(
          ",",
        ),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      TOGGLE_PS_LOCK: "bg-yellow-500",
      TOGGLE_MENTORSHIP_LOCK: "bg-yellow-500",
      TOGGLE_USER_STATUS: "bg-blue-500",
      RESET_PASSWORD: "bg-red-500",
      DELETE_USER: "bg-red-500",
      REMOVE_TEAM_JUDGE_MAPPING: "bg-orange-500",
      MAP_TEAM_TO_JUDGE: "bg-green-500",
      CREATE_USER: "bg-purple-500",
      CREATE_ANNOUNCEMENT: "bg-indigo-500",
      UPDATE_PROBLEM_STATEMENT: "bg-emerald-500",
    };
    return colors[action] || "bg-slate-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Activity Logs</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={onRefreshAction}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>
            Filter logs by action, user, date range, or search terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="w-full space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="action-filter">Action</Label>
              <Select
                value={filters.action}
                onValueChange={(value) => handleFilterChange("action", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-filter">User</Label>
              <Select
                value={filters.user}
                onValueChange={(value) => handleFilterChange("user", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Badge variant="outline">
              {filteredLogs.length} of {logs.length} logs shown
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Logs Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Activity Logs
            {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
          </CardTitle>
          <CardDescription>
            Complete system activity and audit trail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-lg border p-4 hover:bg-slate-50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${getActionColor(log.action)} text-white`}
                      >
                        {log.action}
                      </Badge>
                      <span className="text-sm font-medium">
                        By: {log.user?.username || "Deleted User"}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        @ {log.details}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {log.createdAt}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{log.payload}</p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <p className="text-slate-500">
                  No logs found matching the current filters
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
