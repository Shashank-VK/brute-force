"use client";

import { useEffect, useState } from "react";
import { Award, BookOpen, Calendar, Code2, Flame, Settings, TrendingUp } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { createClient } from "@/lib/supabase/client";

const NumberTicker = dynamic(
  () => import("@/components/ui/number-ticker").then((mod) => mod.NumberTicker),
  { ssr: false }
);

const stats = [
  { label: "Points Earned", value: 1240, icon: TrendingUp },
  { label: "Challenges Solved", value: 23, icon: Code2 },
  { label: "Events Attended", value: 8, icon: Calendar },
  { label: "Day Streak", value: 12, icon: Flame },
];

const recentActivity = [
  { type: "challenge", title: "Solved: Merge Intervals", points: "+25", time: "2 hours ago" },
  { type: "event", title: "Registered: React Workshop", points: "+10", time: "1 day ago" },
  { type: "challenge", title: "Solved: Two Sum", points: "+10", time: "2 days ago" },
  { type: "project", title: "Contributed to: EcoTrack", points: "+15", time: "3 days ago" },
  { type: "event", title: "Attended: System Design Talk", points: "+10", time: "5 days ago" },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNotice(params.get("notice"));
  }, []);

  return (
    <main className="min-h-screen bg-base pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
              </h1>
              <p className="text-muted mt-1">Here&apos;s your activity overview</p>
              {notice ? (
                <p className="mt-3 inline-flex rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
                  {notice}
                </p>
              ) : null}
            </div>
            <Link href="/dashboard/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1.5" /> Settings
              </Button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Stats Grid */}
        <StaggerContainer className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-10" staggerDelay={0.08}>
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl bg-primary/5 p-2.5">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <NumberTicker value={stat.value} className="font-display text-3xl font-bold text-heading" />
                  <p className="text-xs text-muted mt-1 uppercase tracking-wider">{stat.label}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <ScrollReveal delay={0.1}>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-heading mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/5 p-2">
                          {item.type === "challenge" && <Code2 className="h-4 w-4 text-primary" />}
                          {item.type === "event" && <Calendar className="h-4 w-4 text-secondary" />}
                          {item.type === "project" && <BookOpen className="h-4 w-4 text-success" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-heading">{item.title}</p>
                          <p className="text-xs text-muted">{item.time}</p>
                        </div>
                      </div>
                      <Badge variant="success">{item.points}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Quick Actions */}
          <ScrollReveal delay={0.15}>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-heading mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/challenges">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-hover-bg transition-colors cursor-pointer group">
                      <div className="rounded-lg bg-primary/5 p-2.5">
                        <Code2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-heading group-hover:text-primary transition-colors">Solve a Challenge</p>
                        <p className="text-xs text-muted">18 challenges available</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/events">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-hover-bg transition-colors cursor-pointer group">
                      <div className="rounded-lg bg-secondary/5 p-2.5">
                        <Calendar className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-heading group-hover:text-secondary transition-colors">Browse Events</p>
                        <p className="text-xs text-muted">4 upcoming events</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/projects">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-hover-bg transition-colors cursor-pointer group">
                      <div className="rounded-lg bg-success/5 p-2.5">
                        <BookOpen className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-heading group-hover:text-success transition-colors">Explore Projects</p>
                        <p className="text-xs text-muted">6 active projects</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/leaderboard">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-hover-bg transition-colors cursor-pointer group">
                      <div className="rounded-lg bg-warning/5 p-2.5">
                        <Award className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium text-heading group-hover:text-warning transition-colors">View Leaderboard</p>
                        <p className="text-xs text-muted">You&apos;re ranked #8</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
