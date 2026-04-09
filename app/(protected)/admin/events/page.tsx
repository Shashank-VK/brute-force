"use client"

import { type FormEvent, useEffect, useMemo, useState } from "react"
import { Calendar, Loader2, MapPin, Plus, Search, Trash2, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import type { Enums, Tables } from "@/types/supabase"

type EventStatus = Enums<"event_status">

type EventRow = Pick<
  Tables<"events">,
  "id" | "title" | "start_time" | "location" | "registered_count" | "capacity" | "status"
>

const statusOptions: EventStatus[] = ["DRAFT", "PUBLISHED", "COMPLETED"]

function statusBadgeVariant(status: EventStatus): "warning" | "success" | "outline" {
  if (status === "DRAFT") return "warning"
  if (status === "PUBLISHED") return "success"
  return "outline"
}

function statusLabel(status: EventStatus) {
  if (status === "DRAFT") return "Draft"
  if (status === "PUBLISHED") return "Published"
  return "Completed"
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString()
}

export default function AdminEventsPage() {
  const supabase = useMemo(() => createClient(), [])

  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [updatingEventId, setUpdatingEventId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | EventStatus>("ALL")
  const [message, setMessage] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: "",
    startTime: "",
    location: "",
    capacity: "100",
    status: "DRAFT" as EventStatus,
  })

  useEffect(() => {
    let active = true

    const loadEvents = async () => {
      setLoading(true)
      setMessage(null)

      let query = supabase
        .from("events")
        .select("id, title, start_time, location, registered_count, capacity, status")
        .order("start_time", { ascending: true })

      const term = searchTerm.trim()
      if (term.length > 0) {
        query = query.or(`title.ilike.%${term}%,location.ilike.%${term}%`)
      }

      if (statusFilter !== "ALL") {
        query = query.eq("status", statusFilter)
      }

      const { data, error } = await query
      if (!active) {
        return
      }

      if (error) {
        setMessage("Unable to load events right now.")
        setEvents([])
      } else {
        setEvents(data ?? [])
      }

      setLoading(false)
    }

    void loadEvents()

    return () => {
      active = false
    }
  }, [supabase, searchTerm, statusFilter])

  const createEvent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.title.trim() || !form.startTime.trim()) {
      setMessage("Title and start time are required.")
      return
    }

    const parsedStart = new Date(form.startTime)
    if (Number.isNaN(parsedStart.getTime())) {
      setMessage("Enter a valid start time.")
      return
    }

    setSaving(true)
    setMessage(null)

    const { data, error } = await supabase
      .from("events")
      .insert({
        title: form.title.trim(),
        start_time: parsedStart.toISOString(),
        location: form.location.trim() || null,
        capacity: Math.max(1, Number(form.capacity) || 100),
        status: form.status,
      })
      .select("id, title, start_time, location, registered_count, capacity, status")
      .single()

    if (error || !data) {
      setMessage("Unable to create event.")
    } else {
      setEvents((prev) => [data, ...prev])
      setForm({ title: "", startTime: "", location: "", capacity: "100", status: "DRAFT" })
    }

    setSaving(false)
  }

  const updateEventStatus = async (eventId: string, status: EventStatus) => {
    setUpdatingEventId(eventId)
    setMessage(null)

    const { error } = await supabase.from("events").update({ status }).eq("id", eventId)
    if (error) {
      setMessage("Unable to update status.")
    } else {
      setEvents((prev) => prev.map((item) => (item.id === eventId ? { ...item, status } : item)))
    }

    setUpdatingEventId(null)
  }

  const editEvent = async (event: EventRow) => {
    const nextTitle = window.prompt("Event title", event.title)
    if (nextTitle === null) {
      return
    }

    const nextLocation = window.prompt("Location (optional)", event.location ?? "")
    if (nextLocation === null) {
      return
    }

    const nextCapacityRaw = window.prompt("Capacity", String(event.capacity))
    if (nextCapacityRaw === null) {
      return
    }

    const nextCapacity = Math.max(1, Number(nextCapacityRaw) || event.capacity)

    setUpdatingEventId(event.id)
    setMessage(null)

    const { data, error } = await supabase
      .from("events")
      .update({
        title: nextTitle.trim() || event.title,
        location: nextLocation.trim() || null,
        capacity: nextCapacity,
      })
      .eq("id", event.id)
      .select("id, title, start_time, location, registered_count, capacity, status")
      .single()

    if (error || !data) {
      setMessage("Unable to edit event.")
    } else {
      setEvents((prev) => prev.map((item) => (item.id === event.id ? data : item)))
    }

    setUpdatingEventId(null)
  }

  const deleteEvent = async (eventId: string) => {
    const confirmed = window.confirm("Delete this event?")
    if (!confirmed) {
      return
    }

    setUpdatingEventId(eventId)
    setMessage(null)

    const { error } = await supabase.from("events").delete().eq("id", eventId)
    if (error) {
      setMessage("Unable to delete event.")
    } else {
      setEvents((prev) => prev.filter((event) => event.id !== eventId))
    }

    setUpdatingEventId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-heading">Events</h1>
        <Badge variant="outline" className="font-mono">{events.length} Listed</Badge>
      </div>

      {message ? (
        <p className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
          {message}
        </p>
      ) : null}

      <Card>
        <CardContent className="p-5">
          <form className="grid gap-3 md:grid-cols-5" onSubmit={createEvent}>
            <Input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Event title"
              required
            />
            <Input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
              required
            />
            <Input
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Location"
            />
            <Input
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => setForm((prev) => ({ ...prev, capacity: e.target.value }))}
              placeholder="Capacity"
            />
            <div className="flex gap-2">
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as EventStatus }))}
                className="h-10 flex-1 rounded-xl border border-border bg-surface px-3 text-sm text-heading"
                aria-label="Create event status"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{statusLabel(option)}</option>
                ))}
              </select>
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events..."
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "ALL" | EventStatus)}
          className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-heading"
          aria-label="Filter events by status"
        >
          <option value="ALL">All statuses</option>
          {statusOptions.map((option) => (
            <option key={option} value={option}>{statusLabel(option)}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted">Loading events...</CardContent>
          </Card>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted">No events found.</CardContent>
          </Card>
        ) : (
          events.map((event) => {
            const isUpdating = updatingEventId === event.id
            return (
              <Card key={event.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-heading text-lg">{event.title}</h3>
                        <Badge variant={statusBadgeVariant(event.status)}>{statusLabel(event.status)}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDateTime(event.start_time)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location ?? "TBD"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          {event.registered_count}/{event.capacity} registered
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={event.status}
                        onChange={(e) => void updateEventStatus(event.id, e.target.value as EventStatus)}
                        disabled={isUpdating}
                        className="h-9 rounded-lg border border-border bg-surface px-2 text-xs text-heading"
                        aria-label="Update event status"
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>{statusLabel(option)}</option>
                        ))}
                      </select>
                      <Button variant="outline" size="sm" onClick={() => void editEvent(event)} disabled={isUpdating}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => void deleteEvent(event.id)} disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
