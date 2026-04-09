"use client"

import { type FormEvent, useEffect, useMemo, useState } from "react"
import { ExternalLink, Github, Loader2, Plus, Search, Star, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import type { Enums, Tables } from "@/types/supabase"

type ProjectStatus = Enums<"project_status">

type ProjectRow = Pick<
  Tables<"projects">,
  "id" | "title" | "description" | "tech_stack" | "likes_count" | "status" | "featured" | "repo_url" | "live_url"
>

const projectStatuses: ProjectStatus[] = ["IN_PROGRESS", "BETA", "LIVE"]

function statusVariant(status: ProjectStatus): "outline" | "warning" | "success" {
  if (status === "LIVE") return "success"
  if (status === "BETA") return "warning"
  return "outline"
}

function statusLabel(status: ProjectStatus) {
  if (status === "IN_PROGRESS") return "In Progress"
  if (status === "BETA") return "Beta"
  return "Live"
}

export default function AdminProjectsPage() {
  const supabase = useMemo(() => createClient(), [])

  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    status: "IN_PROGRESS" as ProjectStatus,
    repoUrl: "",
    liveUrl: "",
    featured: false,
  })

  useEffect(() => {
    let active = true

    const loadProjects = async () => {
      setLoading(true)
      setMessage(null)

      let query = supabase
        .from("projects")
        .select("id, title, description, tech_stack, likes_count, status, featured, repo_url, live_url")
        .order("created_at", { ascending: false })

      const term = searchTerm.trim()
      if (term.length > 0) {
        query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
      }

      const { data, error } = await query
      if (!active) {
        return
      }

      if (error) {
        setMessage("Unable to load projects right now.")
        setProjects([])
      } else {
        setProjects(data ?? [])
      }

      setLoading(false)
    }

    void loadProjects()

    return () => {
      active = false
    }
  }, [supabase, searchTerm])

  const createProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.title.trim()) {
      setMessage("Project title is required.")
      return
    }

    setSaving(true)
    setMessage(null)

    const techStack = form.techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)

    const { data, error } = await supabase
      .from("projects")
      .insert({
        title: form.title.trim(),
        description: form.description.trim() || null,
        tech_stack: techStack,
        status: form.status,
        repo_url: form.repoUrl.trim() || null,
        live_url: form.liveUrl.trim() || null,
        featured: form.featured,
      })
      .select("id, title, description, tech_stack, likes_count, status, featured, repo_url, live_url")
      .single()

    if (error || !data) {
      setMessage("Unable to create project.")
    } else {
      setProjects((prev) => [data, ...prev])
      setForm({
        title: "",
        description: "",
        techStack: "",
        status: "IN_PROGRESS",
        repoUrl: "",
        liveUrl: "",
        featured: false,
      })
    }

    setSaving(false)
  }

  const toggleFeatured = async (project: ProjectRow) => {
    setUpdatingId(project.id)
    setMessage(null)

    const { error } = await supabase
      .from("projects")
      .update({ featured: !project.featured })
      .eq("id", project.id)

    if (error) {
      setMessage("Unable to update featured state.")
    } else {
      setProjects((prev) => prev.map((item) => (item.id === project.id ? { ...item, featured: !item.featured } : item)))
    }

    setUpdatingId(null)
  }

  const updateStatus = async (projectId: string, status: ProjectStatus) => {
    setUpdatingId(projectId)
    setMessage(null)

    const { error } = await supabase
      .from("projects")
      .update({ status })
      .eq("id", projectId)

    if (error) {
      setMessage("Unable to update project status.")
    } else {
      setProjects((prev) => prev.map((item) => (item.id === projectId ? { ...item, status } : item)))
    }

    setUpdatingId(null)
  }

  const editProject = async (project: ProjectRow) => {
    const nextTitle = window.prompt("Project title", project.title)
    if (nextTitle === null) {
      return
    }

    const nextStack = window.prompt("Tech stack (comma separated)", project.tech_stack.join(", "))
    if (nextStack === null) {
      return
    }

    setUpdatingId(project.id)
    setMessage(null)

    const nextTechStack = nextStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)

    const { data, error } = await supabase
      .from("projects")
      .update({
        title: nextTitle.trim() || project.title,
        tech_stack: nextTechStack,
      })
      .eq("id", project.id)
      .select("id, title, description, tech_stack, likes_count, status, featured, repo_url, live_url")
      .single()

    if (error || !data) {
      setMessage("Unable to update project.")
    } else {
      setProjects((prev) => prev.map((item) => (item.id === project.id ? data : item)))
    }

    setUpdatingId(null)
  }

  const deleteProject = async (projectId: string) => {
    const confirmed = window.confirm("Delete this project?")
    if (!confirmed) {
      return
    }

    setUpdatingId(projectId)
    setMessage(null)

    const { error } = await supabase.from("projects").delete().eq("id", projectId)

    if (error) {
      setMessage("Unable to delete project.")
    } else {
      setProjects((prev) => prev.filter((item) => item.id !== projectId))
    }

    setUpdatingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-heading">Projects</h1>
        <Badge variant="outline" className="font-mono">{projects.length} Listed</Badge>
      </div>

      {message ? (
        <p className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
          {message}
        </p>
      ) : null}

      <Card>
        <CardContent className="p-5">
          <form className="grid gap-3 md:grid-cols-7" onSubmit={createProject}>
            <Input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Project title"
              required
              className="md:col-span-2"
            />
            <Input
              value={form.techStack}
              onChange={(e) => setForm((prev) => ({ ...prev, techStack: e.target.value }))}
              placeholder="Tech stack (React, Node.js)"
              className="md:col-span-2"
            />
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as ProjectStatus }))}
              className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-heading"
              aria-label="Create project status"
            >
              {projectStatuses.map((status) => (
                <option key={status} value={status}>{statusLabel(status)}</option>
              ))}
            </select>
            <Input
              value={form.repoUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, repoUrl: e.target.value }))}
              placeholder="Repo URL"
            />
            <Input
              value={form.liveUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, liveUrl: e.target.value }))}
              placeholder="Demo URL"
            />

            <Input
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              className="md:col-span-4"
            />
            <label className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm text-heading md:col-span-1">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4 rounded border-border"
              />
              Featured
            </label>
            <Button type="submit" size="sm" disabled={saving} className="md:col-span-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add Project
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted">Loading projects...</CardContent>
          </Card>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted">No projects found.</CardContent>
          </Card>
        ) : (
          projects.map((project) => {
            const isUpdating = updatingId === project.id
            return (
              <Card key={project.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-heading">{project.title}</h3>
                        {project.featured ? <Star className="h-4 w-4 text-warning fill-warning" /> : null}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant={statusVariant(project.status)}>{statusLabel(project.status)}</Badge>
                        <select
                          value={project.status}
                          onChange={(e) => void updateStatus(project.id, e.target.value as ProjectStatus)}
                          disabled={isUpdating}
                          className="h-8 rounded-md border border-border bg-surface px-2 text-xs text-heading"
                          aria-label="Update project status"
                        >
                          {projectStatuses.map((status) => (
                            <option key={status} value={status}>{statusLabel(status)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => void editProject(project)} disabled={isUpdating}>
                      Edit
                    </Button>
                  </div>

                  <p className="mb-3 text-sm text-muted min-h-[40px]">{project.description ?? "No description yet."}</p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tech_stack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
                    <span className="text-sm text-muted">{project.likes_count} likes</span>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!project.repo_url}
                        onClick={() => project.repo_url ? window.open(project.repo_url, "_blank", "noopener,noreferrer") : undefined}
                      >
                        <Github className="h-3.5 w-3.5 mr-1.5" /> Repo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!project.live_url}
                        onClick={() => project.live_url ? window.open(project.live_url, "_blank", "noopener,noreferrer") : undefined}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Demo
                      </Button>
                      <Button
                        variant={project.featured ? "default" : "outline"}
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => void toggleFeatured(project)}
                      >
                        <Star className="h-3.5 w-3.5 mr-1.5" /> {project.featured ? "Featured" : "Feature"}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => void deleteProject(project.id)} disabled={isUpdating}>
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
