"use client";

import { Github, Linkedin, Twitter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { TiltCard } from "@/components/ui/tilt-card";

const departments = [
  {
    name: "Leadership",
    members: [
      { name: "Aarav Mehta", role: "President", bio: "Full-stack developer passionate about open source.", avatar: "AM" },
      { name: "Priya Sharma", role: "Vice President", bio: "ML researcher and competitive programmer.", avatar: "PS" },
    ],
  },
  {
    name: "Engineering",
    members: [
      { name: "Rohan Gupta", role: "Tech Lead", bio: "Systems engineer, Rust enthusiast.", avatar: "RG" },
      { name: "Ananya Rao", role: "Frontend Lead", bio: "Design-minded developer building beautiful interfaces.", avatar: "AR" },
      { name: "Vikram Singh", role: "Backend Lead", bio: "Cloud architect and database expert.", avatar: "VS" },
    ],
  },
  {
    name: "Operations",
    members: [
      { name: "Meera Patel", role: "Events Head", bio: "Organizes hackathons and workshops that people actually enjoy.", avatar: "MP" },
      { name: "Karan Joshi", role: "Community Lead", bio: "Building bridges between members and industry.", avatar: "KJ" },
      { name: "Sneha Iyer", role: "Content Lead", bio: "Technical writer and documentation advocate.", avatar: "SI" },
    ],
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-base pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Our Team</p>
            <h1 className="text-4xl font-bold md:text-5xl">The people behind Brute Force</h1>
            <p className="mt-4 text-body text-lg max-w-2xl mx-auto">
              A diverse team of developers, designers, and builders united by a passion for technology.
            </p>
          </div>
        </ScrollReveal>

        {departments.map((dept, deptIndex) => (
          <section key={dept.name} className="mb-16 last:mb-0">
            <ScrollReveal delay={deptIndex * 0.1}>
              <h2 className="text-2xl font-bold text-heading mb-6 flex items-center gap-3">
                <span className="h-1 w-8 rounded-full bg-primary" />
                {dept.name}
              </h2>
            </ScrollReveal>

            <StaggerContainer
              className={`grid gap-6 ${dept.members.length <= 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}
              staggerDelay={0.08}
            >
              {dept.members.map((member) => (
                <StaggerItem key={member.name}>
                  <TiltCard maxTilt={5} glare>
                    <Card className="h-full">
                      <CardContent className="p-6 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold">
                          {member.avatar}
                        </div>
                        <h3 className="text-lg font-semibold text-heading">{member.name}</h3>
                        <Badge variant="default" className="mt-1.5 mb-3">{member.role}</Badge>
                        <p className="text-sm text-muted leading-relaxed">{member.bio}</p>
                        <div className="flex justify-center gap-3 mt-4">
                          <button className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/5 transition-colors">
                            <Github className="h-4 w-4" />
                          </button>
                          <button className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/5 transition-colors">
                            <Linkedin className="h-4 w-4" />
                          </button>
                          <button className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/5 transition-colors">
                            <Twitter className="h-4 w-4" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        ))}
      </div>
    </main>
  );
}
