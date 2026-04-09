"use client"

import { type FormEvent, useEffect, useMemo, useState } from "react"
import { Loader2, Plus, Search, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import type { Enums, Tables } from "@/types/supabase"

type ChallengeDifficulty = Enums<"challenge_difficulty">
type ChallengeStatus = Enums<"event_status">

type ChallengeBase = Pick<
  Tables<"challenges">,
  "id" | "title" | "difficulty" | "points_awarded" | "status"
>

type ChallengeRow = ChallengeBase & {
  submissions_count: number
}

const difficultyOptions: ChallengeDifficulty[] = ["EASY", "MEDIUM", "HARD"]
const statusOptions: ChallengeStatus[] = ["DRAFT", "PUBLISHED", "COMPLETED"]

function difficultyVariant(difficulty: ChallengeDifficulty): "success" | "warning" | "destructive" {
  if (difficulty === "EASY") return "success"
  if (difficulty === "MEDIUM") return "warning"
  return "destructive"
}

function statusVariant(status: ChallengeStatus): "warning" | "success" | "outline" {
  if (status === "DRAFT") return "warning"
  if (status === "PUBLISHED") return "success"
  return "outline"
}

function titleCase(value: string) {
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function AdminChallengesPage() {
  const supabase = useMemo(() => createClient(), [])

  const [challenges, setChallenges] = useState<ChallengeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<"ALL" | ChallengeDifficulty>("ALL")
  const [statusFilter, setStatusFilter] = useState<"ALL" | ChallengeStatus>("ALL")

  const [form, setForm] = useState({
    title: "",
    difficulty: "EASY" as ChallengeDifficulty,
    points: "100",
    status: "DRAFT" as ChallengeStatus,
  })

  useEffect(() => {
    let active = true

    const loadChallenges = async () => {
      setLoading(true)
      setMessage(null)

      let query = supabase
        .from("challenges")
        .select("id, title, difficulty, points_awarded, status")
        .order("created_at", { ascending: false })

      const term = searchTerm.trim()
      if (term.length > 0) {
        query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
      }

      if (difficultyFilter !== "ALL") {
        query = query.eq("difficulty", difficultyFilter)
      }

      if (statusFilter !== "ALL") {
        query = query.eq("status", statusFilter)
      }

      const { data, error } = await query
      if (!active) {
        return
      }

      if (error || !data) {
        setMessage("Unable to load challenges right now.")
        setChallenges([])
        setLoading(false)
        return
      }

      const challengeIds = data.map((item) => item.id)
      const submissionCountMap = new Map<string, number>()

      if (challengeIds.length > 0) {
        const { data: submissions } = await supabase
          .from("submissions")
          .select("challenge_id")
          .in("challenge_id", challengeIds)

        for (const submission of submissions ?? []) {
          submissionCountMap.set(
            submission.challenge_id,
            (submissionCountMap.get(submission.challenge_id) ?? 0) + 1
          )
        }
      }

      const rows: ChallengeRow[] = data.map((item) => ({
        ...item,
        submissions_count: submissionCountMap.get(item.id) ?? 0,
      }))

      setChallenges(rows)
      setLoading(false)
    }

    void loadChallenges()

    return () => {
      active = false
    }
  }, [supabase, searchTerm, difficultyFilter, statusFilter])

  const createChallenge = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.title.trim()) {
      setMessage("Challenge title is required.")
      return
    }

    setSaving(true)
    setMessage(null)

    const { data, error } = await supabase
      .from("challenges")
      .insert({
        title: form.title.trim(),
        difficulty: form.difficulty,
        points_awarded: Math.max(1, Number(form.points) || 100),
        status: form.status,
      })
      .select("id, title, difficulty, points_awarded, status")
      .single()

    if (error || !data) {
      setMessage("Unable to create challenge.")
    } else {
      setChallenges((prev) => [{ ...data, submissions_count: 0 }, ...prev])
      setForm({ title: "", difficulty: "EASY", points: "100", status: "DRAFT" })
    }

    setSaving(false)
  }

  const updateChallengeStatus = async (challengeId: string, status: ChallengeStatus) => {
    setUpdatingId(challengeId)
    setMessage(null)

    const { error } = await supabase
      .from("challenges")
      .update({ status })
      .eq("id", challengeId)

    if (error) {
      setMessage("Unable to update challenge status.")
    } else {
      setChallenges((prev) => prev.map((item) => (item.id === challengeId ? { ...item, status } : item)))
    }

    setUpdatingId(null)
  }

  const editChallenge = async (challenge: ChallengeRow) => {
    const nextTitle = window.prompt("Challenge title", challenge.title)
    if (nextTitle === null) {
      return
    }

    const nextPointsRaw = window.prompt("Points awarded", String(challenge.points_awarded))
    if (nextPointsRaw === null) {
      return
    }

    const nextPoints = Math.max(1, Number(nextPointsRaw) || challenge.points_awarded)

    setUpdatingId(challenge.id)
    setMessage(null)

    const { data, error } = await supabase
      .from("challenges")
      .update({
        title: nextTitle.trim() || challenge.title,
        points_awarded: nextPoints,
      })
      .eq("id", challenge.id)
      .select("id, title, difficulty, points_awarded, status")
      .single()

    if (error || !data) {
      setMessage("Unable to update challenge.")
    } else {
      setChallenges((prev) => prev.map((item) => (item.id === challenge.id ? { ...data, submissions_count: item.submissions_count } : item)))
    }

    setUpdatingId(null)
  }

  const deleteChallenge = async (challengeId: string) => {
    const confirmed = window.confirm("Delete this challenge?")
    if (!confirmed) {
      return
    }

    setUpdatingId(challengeId)
    setMessage(null)

    const { error } = await supabase.from("challenges").delete().eq("id", challengeId)

    if (error) {
      setMessage("Unable to delete challenge.")
    } else {
      setChallenges((prev) => prev.filter((item) => item.id !== challengeId))
    }

    setUpdatingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-heading">Challenges</h1>
        <Badge variant="outline" className="font-mono">{challenges.length} Listed</Badge>
      </div>

      {message ? (
        <p className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
          {message}
        </p>
      ) : null}

      <Card>
        <CardContent className="p-5">
          <form className="grid gap-3 md:grid-cols-5" onSubmit={createChallenge}>
            <Input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Challenge title"
              required
            />
            <select
              value={form.difficulty}
              onChange={(e) => setForm((prev) => ({ ...prev, difficulty: e.target.value as ChallengeDifficulty }))}
              className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-heading"
              aria-label="Create challenge difficulty"
            >
              {difficultyOptions.map((difficulty) => (
                <option key={difficulty} value={difficulty}>{titleCase(difficulty)}</option>
              ))}
            </select>
            <Input
              type="number"
              min={1}
              value={form.points}
              onChange={(e) => setForm((prev) => ({ ...prev, points: e.target.value }))}
              placeholder="Points"
            />
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as ChallengeStatus }))}
              className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-heading"
              aria-label="Create challenge status"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{titleCase(status)}</option>
              ))}
            </select>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search challenges..."
            className="pl-10"
          />
        </div>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value as "ALL" | ChallengeDifficulty)}
          className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-heading"
          aria-label="Filter by challenge difficulty"
        >
          <option value="ALL">All difficulties</option>
          {difficultyOptions.map((difficulty) => (
            <option key={difficulty} value={difficulty}>{titleCase(difficulty)}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "ALL" | ChallengeStatus)}
          className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-heading"
          aria-label="Filter by challenge status"
        >
          <option value="ALL">All statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>{titleCase(status)}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Difficulty</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Points</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Submissions</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">Loading challenges...</td>
                  </tr>
                ) : challenges.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">No challenges found.</td>
                  </tr>
                ) : (
                  challenges.map((challenge) => {
                    const isUpdating = updatingId === challenge.id

                    return (
                      <tr key={challenge.id} className="border-b border-border last:border-0 hover:bg-hover-bg transition-colors">
                        <td className="px-4 py-3 font-medium text-heading text-sm">{challenge.title}</td>
                        <td className="px-4 py-3">
                          <Badge variant={difficultyVariant(challenge.difficulty)}>{titleCase(challenge.difficulty)}</Badge>
                        </td>
                        <td className="px-4 py-3 font-mono text-sm text-heading font-medium">{challenge.points_awarded}</td>
                        <td className="px-4 py-3 font-mono text-sm text-muted">{challenge.submissions_count}</td>
                        <td className="px-4 py-3">
                          <select
                            value={challenge.status}
                            onChange={(e) => void updateChallengeStatus(challenge.id, e.target.value as ChallengeStatus)}
                            disabled={isUpdating}
                            className="h-8 rounded-md border border-border bg-surface px-2 text-xs text-heading"
                            aria-label="Update challenge status"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>{titleCase(status)}</option>
                            ))}
                          </select>
                          <Badge variant={statusVariant(challenge.status)} className="ml-2">{titleCase(challenge.status)}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => void editChallenge(challenge)} disabled={isUpdating}>
                              Edit
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => void deleteChallenge(challenge.id)} disabled={isUpdating}>
                              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
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
