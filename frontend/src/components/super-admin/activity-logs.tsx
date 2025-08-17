"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Filter, Download, RefreshCw } from "lucide-react"
import { apiService } from "@/lib/service"
import { useToast } from "@/hooks/use-toast"
import type { LogEntry, LogFilter } from "@/lib/types"

interface ActivityLogsProps {
  logs: LogEntry[]
  onRefresh: () => void
}

export function ActivityLogs({ logs: initialLogs, onRefresh }: ActivityLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs)
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(initialLogs)
  const [filters, setFilters] = useState<LogFilter>({
    action: "all",
    user: "all",
    dateFrom: "",
    dateTo: "",
    search: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Get unique actions and users for filter dropdowns
  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)))
  const uniqueUsers = Array.from(new Set(logs.map((log) => log.user)))

  useEffect(() => {
    setLogs(initialLogs)
    setFilteredLogs(initialLogs)
  }, [initialLogs])

  useEffect(() => {
    applyFilters()
  }, [filters, logs])

  const applyFilters = async () => {
    setIsLoading(true)
    try {
      // If any filters are applied, fetch from API
      const hasFilters = Object.values(filters).some((value) => value && value.trim() !== "")

      if (hasFilters) {
        const filteredData = await apiService.getFilteredLogs(filters)
        setFilteredLogs(filteredData)
      } else {
        // No filters, show all logs
        setFilteredLogs(logs)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to filter logs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: keyof LogFilter, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      action: "all",
      user: "all",
      dateFrom: "",
      dateTo: "",
      search: "",
    })
  }

  const exportLogs = () => {
    const csvContent = [
      ["Timestamp", "Action", "User", "Target", "Details"].join(","),
      ...filteredLogs.map((log) =>
        [
          log.timestamp,
          log.action,
          log.user,
          log.target,
          log.details.replace(/,/g, ";"), // Replace commas to avoid CSV issues
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `activity-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      "Password Reset": "bg-yellow-500",
      "PS Selection": "bg-blue-500",
      "PS Locked": "bg-red-500",
      "PS Unlocked": "bg-green-500",
      "Judge Scoring": "bg-purple-500",
      "Mentor Booking": "bg-indigo-500",
      "Team Creation": "bg-emerald-500",
      "User Login": "bg-gray-500",
      "User Logout": "bg-gray-400",
    }
    return colors[action] || "bg-slate-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Activity Logs</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
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
          <CardDescription>Filter logs by action, user, date range, or search terms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
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
              <Select value={filters.action} onValueChange={(value) => handleFilterChange("action", value)}>
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
              <Select value={filters.user} onValueChange={(value) => handleFilterChange("user", value)}>
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

            <div className="space-y-2">
              <Label htmlFor="date-from">From Date</Label>
              <Input
                id="date-from"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-to">To Date</Label>
              <Input
                id="date-to"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
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
          <CardDescription>Complete system activity and audit trail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getActionColor(log.action)} text-white`}>{log.action}</Badge>
                      <span className="text-sm font-medium">{log.user}</span>
                    </div>
                    <span className="text-xs text-slate-500">{log.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">
                    <strong>Target:</strong> {log.target}
                  </p>
                  <p className="text-sm text-slate-500">{log.details}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">No logs found matching the current filters</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
