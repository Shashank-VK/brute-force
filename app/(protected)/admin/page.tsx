"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Code2, Eye, Loader2, Users, type LucideIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

type StatCard = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

type TrendPoint = {
  month: string;
  members: number;
  events: number;
};

type MonthBucket = {
  key: string;
  label: string;
};

function monthKey(value: Date) {
  return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, "0")}`;
}

function buildMonthBuckets(length: number): MonthBucket[] {
  const now = new Date();
  const buckets: MonthBucket[] = [];

  for (let index = length - 1; index >= 0; index -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - index, 1));
    buckets.push({
      key: monthKey(date),
      label: date.toLocaleString("en-US", { month: "short" }),
    });
  }

  return buckets;
}

export default function AdminPage() {
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [chartReady, setChartReady] = useState(false);

  const [stats, setStats] = useState<StatCard[]>([
    { label: "Total Members", value: "0", change: "Loading...", icon: Users },
    { label: "Active Challenges", value: "0", change: "Loading...", icon: Code2 },
    { label: "Upcoming Events", value: "0", change: "Loading...", icon: Calendar },
    { label: "Registrations (7d)", value: "0", change: "Loading...", icon: Eye },
  ]);

  const [chartData, setChartData] = useState<TrendPoint[]>([]);

  useEffect(() => {
    setChartReady(true);
  }, []);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      setLoading(true);
      setMessage(null);

      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const monthBuckets = buildMonthBuckets(6);
      const oldestMonthStart = `${monthBuckets[0]?.key ?? monthKey(now)}-01T00:00:00.000Z`;

      const [
        totalMembersRes,
        membersThisMonthRes,
        activeChallengesRes,
        draftChallengesRes,
        upcomingEventsRes,
        registrations7dRes,
        memberTrendRes,
        eventTrendRes,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
        supabase.from("challenges").select("id", { count: "exact", head: true }).eq("status", "PUBLISHED"),
        supabase.from("challenges").select("id", { count: "exact", head: true }).eq("status", "DRAFT"),
        supabase.from("events").select("id", { count: "exact", head: true }).gte("start_time", now.toISOString()).neq("status", "COMPLETED"),
        supabase.from("event_registrations").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo.toISOString()),
        supabase.from("profiles").select("created_at").gte("created_at", oldestMonthStart),
        supabase.from("events").select("created_at").gte("created_at", oldestMonthStart),
      ]);

      if (!active) {
        return;
      }

      const hasError = [
        totalMembersRes.error,
        membersThisMonthRes.error,
        activeChallengesRes.error,
        draftChallengesRes.error,
        upcomingEventsRes.error,
        registrations7dRes.error,
        memberTrendRes.error,
        eventTrendRes.error,
      ].some(Boolean);

      if (hasError) {
        setMessage("Unable to load admin analytics right now.");
      }

      const totalMembers = totalMembersRes.count ?? 0;
      const membersThisMonth = membersThisMonthRes.count ?? 0;
      const activeChallenges = activeChallengesRes.count ?? 0;
      const draftChallenges = draftChallengesRes.count ?? 0;
      const upcomingEvents = upcomingEventsRes.count ?? 0;
      const registrations7d = registrations7dRes.count ?? 0;

      setStats([
        {
          label: "Total Members",
          value: totalMembers.toLocaleString(),
          change: `+${membersThisMonth} this month`,
          icon: Users,
        },
        {
          label: "Active Challenges",
          value: activeChallenges.toLocaleString(),
          change: `${draftChallenges} drafts`,
          icon: Code2,
        },
        {
          label: "Upcoming Events",
          value: upcomingEvents.toLocaleString(),
          change: "Open for registration",
          icon: Calendar,
        },
        {
          label: "Registrations (7d)",
          value: registrations7d.toLocaleString(),
          change: "Last 7 days",
          icon: Eye,
        },
      ]);

      const memberCounts = new Map<string, number>();
      for (const row of memberTrendRes.data ?? []) {
        const key = monthKey(new Date(row.created_at));
        memberCounts.set(key, (memberCounts.get(key) ?? 0) + 1);
      }

      const eventCounts = new Map<string, number>();
      for (const row of eventTrendRes.data ?? []) {
        const key = monthKey(new Date(row.created_at));
        eventCounts.set(key, (eventCounts.get(key) ?? 0) + 1);
      }

      const trend: TrendPoint[] = monthBuckets.map((bucket) => ({
        month: bucket.label,
        members: memberCounts.get(bucket.key) ?? 0,
        events: eventCounts.get(bucket.key) ?? 0,
      }));

      setChartData(trend);
      setLoading(false);
    };

    void loadStats();

    return () => {
      active = false;
    };
  }, [supabase]);

  return (
    <main>
      <div>
        <div className="mb-10">
          <h1 className="text-3xl font-bold md:text-4xl">Admin Dashboard</h1>
          <p className="text-muted mt-1">Club analytics and management</p>
          {message ? (
            <p className="mt-3 inline-flex rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
              {message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-xl bg-primary/5 p-2.5">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="font-display text-2xl font-bold text-heading">{stat.value}</p>
                <p className="text-xs text-muted mt-1">{stat.change}</p>
                <p className="text-xs text-muted uppercase tracking-wider mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-heading mb-6">Growth Overview</h2>
            <div className="h-[300px] min-h-[300px]">
              {!chartReady || loading ? (
                <div className="flex h-full items-center justify-center text-sm text-muted">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading trend data...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8d5b7" />
                    <XAxis dataKey="month" stroke="#9c8b7a" fontSize={12} />
                    <YAxis stroke="#9c8b7a" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#faedcd",
                        border: "1px solid #e8d5b7",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(61,43,31,0.06)",
                      }}
                    />
                    <Line type="monotone" dataKey="members" stroke="#d4a373" strokeWidth={2} dot={{ fill: "#d4a373", r: 4 }} />
                    <Line type="monotone" dataKey="events" stroke="#ccd5ae" strokeWidth={2} dot={{ fill: "#ccd5ae", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
