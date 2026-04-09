"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { Save, User, Lock, Bell, Github, Linkedin, Code2 } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [preferencesSaving, setPreferencesSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [preferences, setPreferences] = useState({
    inAppNotifications: true,
    emailAlerts: false,
  })
  const [profile, setProfile] = useState({
    full_name: "",
    avatar_url: "",
    bio: "",
    github_url: "",
    linkedin_url: "",
    tech_stack: "",
  })

  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()

        if (data) {
          setProfile({
            full_name: data.full_name || "",
            avatar_url: data.avatar_url || "",
            bio: data.bio || "",
            github_url: data.github_url || "",
            linkedin_url: data.linkedin_url || "",
            tech_stack: data.tech_stack ? data.tech_stack.join(", ") : "",
          })
        }

        setPreferences({
          inAppNotifications: user.user_metadata?.inAppNotifications ?? true,
          emailAlerts: user.user_metadata?.emailAlerts ?? false,
        })
      }

      setLoading(false)
    }

    loadProfile()
  }, [supabase])

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatusMessage(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("No user")

      const updates = {
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        github_url: profile.github_url,
        linkedin_url: profile.linkedin_url,
        tech_stack: profile.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      setStatusMessage({ type: "success", text: "Profile updated successfully." })
    } catch (error) {
      setStatusMessage({ type: "error", text: "Unable to save profile right now." })
    } finally {
      setSaving(false)
    }
  }

  const updatePassword = async () => {
    if (!password.newPassword || password.newPassword.length < 6) {
      setStatusMessage({ type: "error", text: "Password must be at least 6 characters." })
      return
    }

    if (password.newPassword !== password.confirmPassword) {
      setStatusMessage({ type: "error", text: "Password confirmation does not match." })
      return
    }

    setPasswordSaving(true)
    setStatusMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({ password: password.newPassword })
      if (error) throw error

      setStatusMessage({ type: "success", text: "Password updated successfully." })
      setPassword({ newPassword: "", confirmPassword: "" })
    } catch {
      setStatusMessage({ type: "error", text: "Unable to update password right now." })
    } finally {
      setPasswordSaving(false)
    }
  }

  const savePreferences = async () => {
    setPreferencesSaving(true)
    setStatusMessage(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("No user")

      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          inAppNotifications: preferences.inAppNotifications,
          emailAlerts: preferences.emailAlerts,
        },
      })

      if (error) throw error

      setStatusMessage({ type: "success", text: "Preferences saved." })
    } catch {
      setStatusMessage({ type: "error", text: "Unable to save preferences right now." })
    } finally {
      setPreferencesSaving(false)
    }
  }

  const togglePreference = (key: "inAppNotifications" | "emailAlerts") => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary font-medium">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-base pt-24">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold md:text-4xl">Settings</h1>
          <p className="text-muted mt-1">Manage your profile, security, and preferences.</p>
          {statusMessage ? (
            <p
              className={`mt-3 inline-flex rounded-lg border px-3 py-2 text-sm ${
                statusMessage.type === "success"
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-error/40 bg-error/10 text-error"
              }`}
            >
              {statusMessage.text}
            </p>
          ) : null}
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" /> Profile</TabsTrigger>
            <TabsTrigger value="security"><Lock className="h-4 w-4 mr-2" /> Security</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" /> Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <form onSubmit={updateProfile}>
                <CardHeader>
                  <CardTitle className="text-2xl">Profile Information</CardTitle>
                  <CardDescription>This information will be displayed on the team page and leaderboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input id="full_name" value={profile.full_name} onChange={(e) => setProfile({...profile, full_name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar_url">Avatar URL</Label>
                      <Input id="avatar_url" value={profile.avatar_url} onChange={(e) => setProfile({...profile, avatar_url: e.target.value})} placeholder="https://github.com/username.png" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      placeholder="Briefly describe your role and interests..."
                      className="flex min-h-[100px] w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary resize-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tech_stack" className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-primary" /> Tech Stack (comma separated)
                    </Label>
                    <Input id="tech_stack" value={profile.tech_stack} onChange={(e) => setProfile({...profile, tech_stack: e.target.value})} placeholder="React, Python, Figma, Docker" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="github_url" className="flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</Label>
                      <Input id="github_url" value={profile.github_url} onChange={(e) => setProfile({...profile, github_url: e.target.value})} placeholder="https://github.com/username" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url" className="flex items-center gap-2"><Linkedin className="h-4 w-4" /> LinkedIn</Label>
                      <Input id="linkedin_url" value={profile.linkedin_url} onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})} placeholder="https://linkedin.com/in/username" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-6">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Profile</>}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Security</CardTitle>
                <CardDescription>Update your password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    className="max-w-md"
                    value={password.newPassword}
                    onChange={(e) => setPassword((prev) => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    className="max-w-md"
                    value={password.confirmPassword}
                    onChange={(e) => setPassword((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={updatePassword} disabled={passwordSaving}>
                  {passwordSaving ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Preferences</CardTitle>
                <CardDescription>Manage notification settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-hover-bg border border-border mb-4">
                  <div>
                    <Label className="text-base text-heading">In-App Notifications</Label>
                    <p className="text-xs text-muted">Receive alerts when challenges are graded.</p>
                  </div>
                  <button
                    type="button"
                    className={`relative h-5 w-10 rounded-full transition-colors ${
                      preferences.inAppNotifications ? "bg-primary" : "bg-border"
                    }`}
                    onClick={() => togglePreference("inAppNotifications")}
                    aria-label="Toggle in-app notifications"
                    aria-pressed={preferences.inAppNotifications}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                        preferences.inAppNotifications ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-hover-bg border border-border">
                  <div>
                    <Label className="text-base text-heading">Email Alerts</Label>
                    <p className="text-xs text-muted">Receive important update emails.</p>
                  </div>
                  <button
                    type="button"
                    className={`relative h-5 w-10 rounded-full transition-colors ${
                      preferences.emailAlerts ? "bg-primary" : "bg-border"
                    }`}
                    onClick={() => togglePreference("emailAlerts")}
                    aria-label="Toggle email alerts"
                    aria-pressed={preferences.emailAlerts}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                        preferences.emailAlerts ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={savePreferences} disabled={preferencesSaving}>
                  {preferencesSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
