"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Code2, Search, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { TiltCard } from "@/components/ui/tilt-card";

const challenges = [
  { id: 1, title: "Two Sum", difficulty: "Easy", category: "Arrays", points: 10, submissions: 89, solved: true, description: "Given an array of integers, return indices of the two numbers that add up to a target." },
  { id: 2, title: "Merge Intervals", difficulty: "Medium", category: "Arrays", points: 25, submissions: 52, solved: false, description: "Given an array of intervals, merge all overlapping intervals." },
  { id: 3, title: "LRU Cache", difficulty: "Hard", category: "Design", points: 50, submissions: 23, solved: false, description: "Design a data structure that follows the constraints of a Least Recently Used cache." },
  { id: 4, title: "Valid Parentheses", difficulty: "Easy", category: "Stack", points: 10, submissions: 95, solved: true, description: "Given a string containing just bracket characters, determine if the input string is valid." },
  { id: 5, title: "Binary Tree Level Order", difficulty: "Medium", category: "Trees", points: 25, submissions: 41, solved: false, description: "Given a binary tree, return the level order traversal of its nodes' values." },
  { id: 6, title: "Word Search II", difficulty: "Hard", category: "Trie", points: 50, submissions: 15, solved: false, description: "Given a 2D board and a list of words, find all words present in the board." },
];

const difficultyColors: Record<string, "success" | "warning" | "destructive"> = {
  Easy: "success",
  Medium: "warning",
  Hard: "destructive",
};

export default function ChallengesPage() {
  const [search, setSearch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  const filtered = challenges.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = filterDifficulty === "All" || c.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <main className="min-h-screen bg-base pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Challenges</p>
            <h1 className="text-4xl font-bold md:text-5xl">Test your skills</h1>
            <p className="mt-4 text-body text-lg max-w-2xl">
              Solve coding challenges, earn points, and climb the leaderboard.
            </p>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                placeholder="Search challenges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["All", "Easy", "Medium", "Hard"].map((d) => (
                <button
                  key={d}
                  onClick={() => setFilterDifficulty(d)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    filterDifficulty === d
                      ? "bg-primary text-white"
                      : "bg-hover-bg text-body hover:bg-border"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Challenge Cards */}
        <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
          {filtered.map((challenge) => (
            <StaggerItem key={challenge.id}>
              <TiltCard maxTilt={3}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={difficultyColors[challenge.difficulty]}>{challenge.difficulty}</Badge>
                      <div className="flex items-center gap-1">
                        {challenge.solved ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <span className="text-sm font-mono font-bold text-primary">{challenge.points} pts</span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-heading mb-2">{challenge.title}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-4">{challenge.description}</p>

                    <div className="flex items-center justify-between text-sm text-muted mb-4">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="h-3.5 w-3.5" /> {challenge.category}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Send className="h-3.5 w-3.5" /> {challenge.submissions} submissions
                      </span>
                    </div>

                    <Button
                      variant={challenge.solved ? "outline" : "default"}
                      className="w-full"
                      size="sm"
                    >
                      {challenge.solved ? "View Solution" : "Solve Challenge"}
                    </Button>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </main>
  );
}
