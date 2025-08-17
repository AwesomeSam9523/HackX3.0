"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, RotateCcw, UserCheck, UserX } from "lucide-react"
import { apiService } from "@/lib/service"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"

interface UserManagementTabProps {
  users: User[]
  onUserUpdate: () => void
}

export function UserManagementTab({ users, onUserUpdate }: UserManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  // Get unique roles for filter
  const uniqueRoles = useMemo(() => {
    const roleSet = new Set(users.filter((user) => user.role).map((user) => user.role))
    return Array.from(roleSet).sort()
  }, [users])

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchTerm, roleFilter, statusFilter])

  const handleResetUserPassword = async (userId: string) => {
    try {
      await apiService.resetPassword(userId)
      toast({
        title: "Success",
        description: "Password reset successfully",
      })
      onUserUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive",
      })
    }
  }

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await apiService.toggleUserStatus(userId)
      toast({
        title: "Success",
        description: "User status updated successfully",
      })
      onUserUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setRoleFilter("all")
    setStatusFilter("all")
  }

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      participant: "bg-blue-500",
      mentor: "bg-green-500",
      judge: "bg-purple-500",
      admin: "bg-orange-500",
      super_admin: "bg-red-500",
    }
    return colors[role] || "bg-gray-500"
  }

  const formatRole = (role: string | undefined | null) => {
    if (!role) return "Unknown"
    return role.replace("_", " ").toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-slate-600">
            {users.length} total users • {filteredUsers.length} shown
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
          <CardDescription>Filter users by username, role, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search Users</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {uniqueRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {formatRole(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Actions</Label>
              <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Badge variant="outline">
              Showing {filteredUsers.length} of {users.length} users
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user accounts, passwords, and access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getRoleColor(user.role || "")}`} />
                    <div>
                      <h4 className="font-medium">{user.username || "Unknown User"}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {formatRole(user.role)}
                        </Badge>
                        {user.teamId && (
                          <Badge variant="secondary" className="text-xs">
                            Team ID: {user.teamId}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                      {user.status === "Active" ? (
                        <UserCheck className="h-3 w-3 mr-1" />
                      ) : (
                        <UserX className="h-3 w-3 mr-1" />
                      )}
                      {user.status || "Unknown"}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => handleResetUserPassword(user.id)}>
                      Reset Password
                    </Button>
                    <Button
                      size="sm"
                      variant={user.status === "Active" ? "destructive" : "default"}
                      onClick={() => handleToggleUserStatus(user.id)}
                    >
                      {user.status === "Active" ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">No users found matching the current filters</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === "Active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Disabled Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{users.filter((u) => u.status === "Disabled").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
