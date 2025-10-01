"use client";

import { useMemo, useState } from "react";
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
import { Filter, RotateCcw, Search, UserCheck, UserX } from "lucide-react";
import { apiService } from "@/lib/service";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/types";

interface UserManagementTabProps {
  users: User[];
  onUserUpdateAction: () => void;
}

export function UserManagementTab({
  users,
  onUserUpdateAction,
}: UserManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  // Get unique roles for filter
  const uniqueRoles = useMemo(() => {
    const roleSet = new Set(
      users.filter((user) => user.role).map((user) => user.role),
    );
    return Array.from(roleSet).sort();
  }, [users]);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleResetUserPassword = async (userId: string) => {
    try {
      const { message, newPassword } = await apiService.resetPassword(userId);
      toast({
        title: "Success",
        description: message,
      });
      alert(`New password for user is:\n${newPassword}`);
      onUserUpdateAction();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive",
      });
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await apiService.toggleUserStatus(userId);
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
      onUserUpdateAction();
      users.forEach((user) => {
        if (user.id === userId) {
          user.status = user.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
        }
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      TEAM: "bg-blue-500",
      MENTOR: "bg-green-500",
      JUDGE: "bg-purple-500",
      ADMIN: "bg-orange-500",
      SUPER_ADMIN: "bg-red-500",
    };
    return colors[role] || "bg-gray-500";
  };

  const formatRole = (role: string | undefined | null) => {
    if (!role) return "Unknown";
    return role.replace("_", " ").toUpperCase();
  };

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
          <CardDescription>
            Filter users by username, role, or status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <div className="space-y-2 w-full">
              <Label>Search Users</Label>
              <div className="relative">
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
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
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full bg-transparent"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
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
          <CardDescription>
            Manage user accounts, passwords, and access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${getRoleColor(user.role || "")}`}
                    />
                    <div>
                      <h4 className="font-medium">
                        {user.username || "Unknown User"}
                      </h4>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {formatRole(user.role)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          ID: {user.id}
                        </Badge>
                        {user.teamId && (
                          <Badge variant="secondary" className="text-xs">
                            Team Name: {user.participantTeam.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        user.status === "ACTIVE" ? "default" : "destructive"
                      }
                    >
                      {user.status === "ACTIVE" ? (
                        <UserCheck className="mr-1 h-3 w-3" />
                      ) : (
                        <UserX className="mr-1 h-3 w-3" />
                      )}
                      {user.status || "Unknown"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResetUserPassword(user.id)}
                    >
                      Reset Password
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        user.status === "ACTIVE" ? "destructive" : "default"
                      }
                      onClick={() => handleToggleUserStatus(user.id)}
                    >
                      {user.status === "ACTIVE" ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <p className="text-slate-500">
                  No users found matching the current filters
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

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.status === "ACTIVE").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Disabled Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {users.filter((u) => u.status === "DISABLED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
