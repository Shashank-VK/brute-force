"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { TiltCard } from "@/components/ui/tilt-card";

const upcomingEvents = [
  { id: 1, title: "Spring Hackathon 2026", date: "Apr 19-20, 2026", time: "9:00 AM", location: "Main Auditorium", attendees: 80, type: "Hackathon", description: "48-hour hackathon focused on building AI-powered applications. Teams of 3-5.", deadline: "2026-04-19T09:00:00" },
  { id: 2, title: "React Workshop", date: "Apr 25, 2026", time: "2:00 PM", location: "Lab 204", attendees: 35, type: "Workshop", description: "Hands-on workshop covering React Server Components and the App Router.", deadline: "2026-04-25T14:00:00" },
  { id: 3, title: "Cloud Infrastructure Talk", date: "May 2, 2026", time: "5:00 PM", location: "Room 301", attendees: 50, type: "Talk", description: "Guest speaker from AWS on scalable architecture patterns.", deadline: "2026-05-02T17:00:00" },
  { id: 4, title: "Git & Open Source Night", date: "May 10, 2026", time: "6:00 PM", location: "Co-working Space", attendees: 25, type: "Workshop", description: "Learn to contribute to open source projects and master Git workflows.", deadline: "2026-05-10T18:00:00" },
];

const pastEvents = [
  { id: 5, title: "Winter Code Jam", date: "Jan 15, 2026", attendees: 65, type: "Hackathon" },
  { id: 6, title: "Python for Data Science", date: "Feb 8, 2026", attendees: 40, type: "Workshop" },
  { id: 7, title: "System Design Masterclass", date: "Mar 1, 2026", attendees: 55, type: "Talk" },
];

const typeColors: Record<string, "default" | "secondary" | "warning"> = {
  Hackathon: "default",
  Workshop: "secondary",
  Talk: "warning",
};

function CountdownTimer({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className="flex gap-2 mt-3">
      {[
        { val: timeLeft.days, label: "D" },
        { val: timeLeft.hours, label: "H" },
        { val: timeLeft.mins, label: "M" },
        { val: timeLeft.secs, label: "S" },
      ].map((unit) => (
        <div key={unit.label} className="flex flex-col items-center rounded-lg bg-primary/5 px-2.5 py-1.5 min-w-[40px]">
          <span className="font-mono text-lg font-bold text-heading leading-none">{String(unit.val).padStart(2, "0")}</span>
          <span className="text-[10px] text-muted uppercase">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function EventsPage() {
  const [registeredIds, setRegisteredIds] = useState<number[]>([]);

  return (
    <main className="min-h-screen bg-base pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Events</p>
            <h1 className="text-4xl font-bold md:text-5xl">What&apos;s happening</h1>
            <p className="mt-4 text-body text-lg max-w-2xl">
              Hackathons, workshops, tech talks, and more. Join us and level up your skills.
            </p>
          </div>
        </ScrollReveal>

        <Tabs defaultValue="upcoming" className="w-full">
          <ScrollReveal delay={0.1}>
            <TabsList className="mb-8">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>
          </ScrollReveal>

          <TabsContent value="upcoming">
            <StaggerContainer className="grid gap-6 md:grid-cols-2" staggerDelay={0.08}>
              {upcomingEvents.map((event) => (
                <StaggerItem key={event.id}>
                  <TiltCard maxTilt={4}>
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <Badge variant={typeColors[event.type]}>{event.type}</Badge>
                          <div className="flex items-center gap-1 text-xs text-muted">
                            <Users className="h-3.5 w-3.5" />
                            {event.attendees}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-heading mb-2">{event.title}</h3>
                        <p className="text-sm text-muted mb-4 leading-relaxed">{event.description}</p>

                        {/* Countdown Timer */}
                        <CountdownTimer deadline={event.deadline} />

                        <div className="space-y-2 text-sm text-body mt-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            {event.location}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setRegisteredIds((prev) =>
                              prev.includes(event.id) ? prev.filter((id) => id !== event.id) : [...prev, event.id]
                            )
                          }
                          className={`mt-5 w-full rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
                            registeredIds.includes(event.id)
                              ? "bg-success/10 text-success border border-success/20"
                              : "bg-primary text-white hover:bg-primary-dark hover:shadow-button-glow"
                          }`}
                        >
                          {registeredIds.includes(event.id) ? "Registered" : "Register"}
                        </button>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </TabsContent>

          <TabsContent value="past">
            <StaggerContainer className="space-y-3" staggerDelay={0.06}>
              {pastEvents.map((event) => (
                <StaggerItem key={event.id}>
                  <Card>
                    <CardContent className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-4">
                        <Badge variant={typeColors[event.type]}>{event.type}</Badge>
                        <div>
                          <h3 className="font-semibold text-heading">{event.title}</h3>
                          <p className="text-sm text-muted">{event.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted">
                        <Users className="h-4 w-4" />
                        {event.attendees} attended
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
