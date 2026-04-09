"use client";

import { Crown, Medal, Trophy } from "lucide-react";
import dynamic from "next/dynamic";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";

const NumberTicker = dynamic(
  () => import("@/components/ui/number-ticker").then((mod) => mod.NumberTicker),
  { ssr: false }
);

const leaderboardData = [
  { rank: 1, name: "Priya Sharma", points: 2840, solved: 47, streak: 21 },
  { rank: 2, name: "Rohan Gupta", points: 2650, solved: 42, streak: 18 },
  { rank: 3, name: "Aarav Mehta", points: 2510, solved: 39, streak: 15 },
  { rank: 4, name: "Ananya Rao", points: 2280, solved: 35, streak: 12 },
  { rank: 5, name: "Vikram Singh", points: 2100, solved: 33, streak: 10 },
  { rank: 6, name: "Meera Patel", points: 1920, solved: 30, streak: 8 },
  { rank: 7, name: "Karan Joshi", points: 1750, solved: 27, streak: 7 },
  { rank: 8, name: "Sneha Iyer", points: 1580, solved: 24, streak: 5 },
  { rank: 9, name: "Dev Malhotra", points: 1420, solved: 22, streak: 4 },
  { rank: 10, name: "Riya Kapoor", points: 1290, solved: 20, streak: 3 },
];

function getRankBadge(points: number) {
  if (points >= 1000) return { label: "Legend", variant: "default" as const };
  if (points >= 500) return { label: "Expert", variant: "warning" as const };
  if (points >= 100) return { label: "Contributor", variant: "secondary" as const };
  return { label: "Newbie", variant: "outline" as const };
}

const podiumColors = [
  { bg: "from-warning/20 to-warning/5", border: "border-warning/30", icon: Crown, accent: "text-warning" },
  { bg: "from-muted/20 to-muted/5", border: "border-muted/30", icon: Medal, accent: "text-muted" },
  { bg: "from-warning/10 to-warning/5", border: "border-warning/20", icon: Trophy, accent: "text-warning/70" },
];

export default function LeaderboardPage() {
  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <main className="min-h-screen bg-base pt-24">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Leaderboard</p>
            <h1 className="text-4xl font-bold md:text-5xl">Top performers</h1>
            <p className="mt-4 text-body text-lg max-w-2xl mx-auto">
              Rankings based on challenge points, problems solved, and activity streaks.
            </p>
          </div>
        </ScrollReveal>

        {/* Podium */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-3 gap-4 mb-12 items-end">
            {[top3[1], top3[0], top3[2]].map((user, i) => {
              const config = podiumColors[i === 0 ? 1 : i === 1 ? 0 : 2];
              const PodiumIcon = config.icon;
              const height = i === 1 ? "min-h-[220px]" : "min-h-[180px]";
              const rankBadge = getRankBadge(user.points);

              return (
                <Card key={user.rank} className={`${config.border} overflow-hidden`}>
                  <CardContent className={`p-6 text-center bg-gradient-to-b ${config.bg} ${height} flex flex-col items-center justify-center`}>
                    <PodiumIcon className={`h-8 w-8 ${config.accent} mb-3`} />
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-lg font-bold mb-3">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <h3 className="font-semibold text-heading text-sm md:text-base">{user.name}</h3>
                    <Badge variant={rankBadge.variant} className="mt-1 text-[10px]">{rankBadge.label}</Badge>
                    <div className="mt-2">
                      <NumberTicker value={user.points} className="font-display text-2xl font-bold text-heading" />
                      <p className="text-xs text-muted mt-0.5">points</p>
                    </div>
                    <div className="flex gap-4 mt-3 text-xs text-muted">
                      <span>{user.solved} solved</span>
                      <span>{user.streak}d streak</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Remaining Rankings */}
        <StaggerContainer className="space-y-2" staggerDelay={0.05}>
          {rest.map((user) => {
            const rankBadge = getRankBadge(user.points);
            return (
              <StaggerItem key={user.rank}>
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <span className="w-8 text-center font-mono text-lg font-bold text-muted">
                        {user.rank}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hover-bg text-sm font-semibold text-body">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-heading">{user.name}</h3>
                          <Badge variant={rankBadge.variant} className="text-[10px]">{rankBadge.label}</Badge>
                        </div>
                        <p className="text-xs text-muted">{user.solved} problems solved</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-heading">{user.points.toLocaleString()}</p>
                      <p className="text-xs text-muted">{user.streak}d streak</p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </main>
  );
}
