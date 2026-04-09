"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Search, Shield, UserCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import type { Enums, Tables } from "@/types/supabase"

type UserRole = Enums<"user_role">

type ProfileRow = Pick<
  Tables<"profiles">,
  "id" | "full_name" | "email" | "role" | "total_score" | "streak_count" | "created_at"
>

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}

export default function AdminUsersPage() {
  const supabase = useMemo(() => createClient(), [])

  const [users, setUsers] = useState<ProfileRow[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL")
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (active) {
        setCurrentUserId(user?.id ?? null)
      }
    }

    const loadUsers = async () => {
      setLoading(true)
      setMessage(null)

      let query = supabase
        .from("profiles")
        .select("id, full_name, email, role, total_score, streak_count, created_at")
        .order("created_at", { ascending: false })

      const term = searchTerm.trim()
      if (term.length > 0) {
        query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`)
      }

      if (roleFilter !== "ALL") {
        query = query.eq("role", roleFilter)
      }

      const { data, error } = await query
      if (!active) {
        return
      }

      if (error) {
        setMessage("Unable to load users right now.")
        setUsers([])
      } else {
        setUsers(data ?? [])
      }

      setLoading(false)
    }

    void loadCurrentUser()
    void loadUsers()

    return () => {
      active = false
    }
  }, [supabase, searchTerm, roleFilter])

  const toggleRole = async (user: ProfileRow) => {
    const targetRole: UserRole = user.role === "ADMIN" ? "MEMBER" : "ADMIN"
    const isSelfDemotion = user.id === currentUserId && user.role === "ADMIN"
    if (isSelfDemotion) {
      setMessage("Use another admin account before removing your own admin role.")
      return
    }

    setUpdatingUserId(user.id)
    setMessage(null)

    const { error } = await supabase
      .from("profiles")
      .update({ role: targetRole })
      .eq("id", user.id)

    if (error) {
      setMessage("Role update failed. Please try again.")
    } else {
      setUsers((prev) => prev.map((item) => (item.id === user.id ? { ...item, role: targetRole } : item)))
    }

    setUpdatingUserId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-heading">Users</h1>
        <Badge variant="default" className="font-mono">{users.length} Total</Badge>
      </div>

      {message ? (
        <p className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
          {message}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="pl-10"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as "ALL" | UserRole)}
          className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-heading"
          aria-label="Filter users by role"
        >
          <option value="ALL">All roles</option>
          <option value="ADMIN">Admins</option>
          <option value="MEMBER">Members</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Points</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Streak</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const initials = user.full_name
                      .split(" ")
                      .map((namePart) => namePart[0] ?? "")
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()

                    const isUpdating = updatingUserId === user.id
                    const isSelfAdmin = user.id === currentUserId && user.role === "ADMIN"

                    return (
                      <tr key={user.id} className="border-b border-border last:border-0 hover:bg-hover-bg transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {initials}
                            </div>
                            <span className="font-medium text-heading text-sm">{user.full_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted">{user.email ?? "No email"}</td>
                        <td className="px-4 py-3">
                          <Badge variant={user.role === "ADMIN" ? "default" : "outline"} className="text-xs">
                            {user.role === "ADMIN" ? <Shield className="h-3 w-3 mr-1" /> : null}
                            {user.role.toLowerCase()}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-mono text-sm text-heading font-medium">{user.total_score}</td>
                        <td className="px-4 py-3 font-mono text-sm text-heading">{user.streak_count} days</td>
                        <td className="px-4 py-3 text-sm text-muted">{formatDate(user.created_at)}</td>
                        <td className="px-4 py-3">
                          <Button
                            variant={user.role === "ADMIN" ? "outline" : "default"}
                            size="sm"
                            onClick={() => void toggleRole(user)}
                            disabled={isUpdating || isSelfAdmin}
                            className="min-w-[110px]"
                          >
                            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                            {user.role === "ADMIN" ? "Set Member" : "Set Admin"}
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
