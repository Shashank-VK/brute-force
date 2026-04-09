"use client";

import { useState } from "react";
import { ExternalLink, Github, Heart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { TiltCard } from "@/components/ui/tilt-card";

const projects = [
  { id: 1, title: "EcoTrack", description: "Carbon footprint tracker using ML to analyze daily activities and suggest eco-friendly alternatives.", tech: ["Python", "React", "TensorFlow"], domain: "AI/ML", stars: 45, status: "Live" },
  { id: 2, title: "StudySync", description: "Collaborative study platform with real-time note sharing, video calls, and AI-powered flashcards.", tech: ["Next.js", "WebRTC", "PostgreSQL"], domain: "Web", stars: 32, status: "Live" },
  { id: 3, title: "SecureVault", description: "End-to-end encrypted password manager with biometric authentication and breach detection.", tech: ["Rust", "React Native", "SQLite"], domain: "Security", stars: 28, status: "Beta" },
  { id: 4, title: "DroneMapper", description: "Autonomous drone navigation system for campus mapping and delivery simulations.", tech: ["Python", "ROS", "OpenCV"], domain: "IoT", stars: 19, status: "In Progress" },
  { id: 5, title: "HealthPulse", description: "Wearable data aggregator that provides health insights using predictive analytics.", tech: ["TypeScript", "Node.js", "D3.js"], domain: "Web", stars: 37, status: "Live" },
  { id: 6, title: "CodeReview AI", description: "Automated code review assistant that catches bugs and suggests improvements.", tech: ["Python", "GPT-4", "GitHub API"], domain: "AI/ML", stars: 52, status: "Beta" },
];

const domains = ["All", "Web", "AI/ML", "Security", "IoT"];

const statusColors: Record<string, "success" | "warning" | "default"> = {
  Live: "success",
  Beta: "warning",
  "In Progress": "default",
};

export default function ProjectsPage() {
  const [activeDomain, setActiveDomain] = useState("All");
  const [likedIds, setLikedIds] = useState<number[]>([]);

  const filtered = activeDomain === "All" ? projects : projects.filter((p) => p.domain === activeDomain);

  return (
    <main className="min-h-screen bg-base pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Projects</p>
            <h1 className="text-4xl font-bold md:text-5xl">What we&apos;ve built</h1>
            <p className="mt-4 text-body text-lg max-w-2xl">
              Real projects shipped by Brute Force members. From AI tools to security systems.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-10">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() => setActiveDomain(domain)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeDomain === domain
                    ? "bg-primary text-white shadow-button-glow"
                    : "bg-hover-bg text-body hover:bg-border hover:text-heading"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
          {filtered.map((project) => (
            <StaggerItem key={project.id}>
              <TiltCard maxTilt={4}>
                <Card className="h-full flex flex-col">
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={statusColors[project.status]}>{project.status}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted">
                        <Star className="h-3.5 w-3.5" />
                        {project.stars}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-heading mb-2">{project.title}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-4 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tech.map((t) => (
                        <span key={t} className="rounded-md bg-hover-bg px-2 py-1 text-xs font-medium text-body">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Github className="h-4 w-4 mr-1.5" /> Code
                      </Button>
                      <Button size="sm" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-1.5" /> Demo
                      </Button>
                      <button
                        onClick={() =>
                          setLikedIds((prev) =>
                            prev.includes(project.id) ? prev.filter((id) => id !== project.id) : [...prev, project.id]
                          )
                        }
                        className={`flex items-center justify-center rounded-xl border px-3 transition-all duration-200 ${
                          likedIds.includes(project.id)
                            ? "border-error/20 bg-error/5 text-error"
                            : "border-border text-muted hover:text-error hover:border-error/20"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${likedIds.includes(project.id) ? "fill-current" : ""}`} />
                      </button>
                    </div>
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
