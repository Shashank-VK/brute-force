import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, Cpu, Globe, Rocket, Sparkles, Trophy, Users, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { TiltCard } from "@/components/ui/tilt-card";

const GooeyText = dynamic(
  () => import("@/components/ui/gooey-text-morphing").then((mod) => mod.GooeyText),
  { ssr: false }
);

const NumberTicker = dynamic(
  () => import("@/components/ui/number-ticker").then((mod) => mod.NumberTicker),
  { ssr: false }
);

const heroMorphTexts = ["CODE", "BUILD", "INNOVATE"];

const photos = [
  {
    alt: "Hackathon floor with students",
    caption: "Hackathon Nights",
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  },
  {
    alt: "Team collaboration around laptops",
    caption: "Team Build Sessions",
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    alt: "Live workshop presentation",
    caption: "Live Workshops",
    src: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=1200&q=80",
  },
  {
    alt: "Tech conference stage",
    caption: "Conference Days",
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  },
  {
    alt: "Students coding in low light",
    caption: "After-Hours Coding",
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    alt: "Demo day celebration",
    caption: "Demo Day",
    src: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-base">

      {/* ── Hero Section ── */}
      <section className="pt-28 pb-14 px-6 text-center">
        <ScrollReveal delay={0.1}>
          <p className="text-primary font-semibold tracking-[0.2em] uppercase text-sm md:text-base mb-3">
            University Tech Club
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="h-20 md:h-28 mb-2">
            <GooeyText
              texts={heroMorphTexts}
              morphTime={1}
              cooldownTime={0.25}
              className="justify-center items-center"
              textClassName="font-display font-bold tracking-tight text-heading text-5xl md:text-7xl lg:text-8xl text-center"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="mt-4 text-muted tracking-[0.15em] uppercase text-xs md:text-sm">
            Code, Build, Innovate in 3D
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-8 space-y-3">
            <p className="text-primary text-sm md:text-base font-medium">
              Registrations for our Annual Hackathon are Live
            </p>
            <div className="flex flex-col items-center gap-2 mt-4">
              <Link href="/events">
                <Button size="lg" className="px-10">
                  Register Now
                </Button>
              </Link>
              <Link
                href="/challenges"
                className="text-sm text-muted underline underline-offset-4 hover:text-heading transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Auto-Scrolling Photo Strip ── */}
      <section className="py-6">
        <Marquee pauseOnHover className="[--duration:25s]">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="group relative mx-2 h-40 w-56 flex-shrink-0 overflow-hidden rounded-2xl border border-border shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-card-hover md:h-48 md:w-72 animate-float"
              style={{ animationDelay: `${i * 140}ms` }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 224px, 288px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <span className="absolute bottom-2 left-3 text-xs font-mono tracking-wide text-white/90">
                {photo.caption}
              </span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-12 px-6">
        <StaggerContainer className="grid gap-4 max-w-5xl mx-auto grid-cols-2 md:grid-cols-4" staggerDelay={0.08}>
          {[
            { label: "Active Members", value: 124, icon: Users },
            { label: "Events Hosted", value: 42, icon: Terminal },
            { label: "Challenges", value: 18, icon: Trophy },
            { label: "Projects Shipped", value: 56, icon: Sparkles },
          ].map((stat) => (
            <StaggerItem key={stat.label}>
              <TiltCard maxTilt={4}>
                <Card>
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="rounded-xl bg-primary/10 p-3">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <NumberTicker value={stat.value} className="font-display text-3xl font-bold text-heading" />
                      <p className="text-xs uppercase tracking-wider text-muted mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── Our Mission ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <ScrollReveal direction="left">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-wide mb-6">
                OUR MISSION
              </h2>
              <p className="text-body leading-relaxed text-base md:text-lg">
                As the premier tech club on campus, we aim to educate our
                community on the latest technology trends and skills. We
                facilitate hands-on learning, foster collaboration, and build
                bridges between students and the tech industry — on campus
                and beyond.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <div className="w-full h-64 md:h-80 rounded-2xl bg-gradient-to-br from-primary/10 via-surface to-secondary/10 border border-border flex items-center justify-center shadow-card">
              <span className="text-sm text-muted font-mono">Mission photo placeholder</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className="section-padding bg-surface/50">
        <div className="container-tight">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">What We Do</p>
              <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                Where builders come together
              </h2>
              <p className="mt-4 text-body max-w-2xl mx-auto text-lg">
                From hackathons to workshops, challenges to deployments — we create the environment for you to level up.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
            {[
              { icon: Code2, title: "Hackathons & Events", desc: "Regular hackathons, tech talks, and hands-on workshops with industry mentors." },
              { icon: Trophy, title: "Coding Challenges", desc: "Weekly challenges across difficulty levels. Compete, learn, and climb the leaderboard." },
              { icon: Rocket, title: "Real Projects", desc: "Ship real products as a team. From ideation to deployment, build things that matter." },
              { icon: Globe, title: "Community", desc: "Connect with 120+ developers, designers, and builders across all skill levels." },
              { icon: Cpu, title: "Tech Stack", desc: "Learn modern technologies — React, Python, AI/ML, cloud infrastructure, and more." },
              { icon: Sparkles, title: "Mentorship", desc: "Get guidance from senior members and industry professionals throughout your journey." },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <TiltCard maxTilt={5} glare>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="rounded-xl bg-primary/10 p-3 w-fit mb-4">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-heading mb-2">{item.title}</h3>
                      <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Tech Stack Marquee ── */}
      <section className="py-16 border-y border-border">
        <ScrollReveal>
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted mb-8">
            Technologies We Work With
          </p>
        </ScrollReveal>
        <Marquee className="[--duration:30s]">
          {["React", "Next.js", "TypeScript", "Python", "Node.js", "PostgreSQL", "Docker", "AWS", "Tailwind CSS", "Figma", "Git", "Rust"].map((tech) => (
            <div
              key={tech}
              className="mx-4 flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-body shadow-card"
            >
              {tech}
            </div>
          ))}
        </Marquee>
      </section>

      {/* ── Contact / Join Us ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <ScrollReveal direction="left">
            <div className="w-full h-64 md:h-80 rounded-2xl bg-gradient-to-br from-secondary/15 via-surface to-primary/10 border border-border flex items-center justify-center shadow-card">
              <span className="text-sm text-muted font-mono">Campus photo placeholder</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-primary tracking-wide mb-6">
                CONTACT US
              </h2>
              <p className="text-body leading-relaxed text-base md:text-lg mb-8">
                Reach out here to learn about club events, join our
                newsletter, or just say hi!
              </p>
              <Link href="/signup">
                <Button size="lg" className="px-10">
                  Contact
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section-padding">
        <div className="container-tight">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-12 md:p-16 text-center">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl mb-4">
                  Ready to build something great?
                </h2>
                <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                  Join 120+ members who are shipping projects, winning hackathons, and growing as engineers.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover:shadow-float hover:scale-[1.02]">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/team">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                      Meet the Team
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-12 px-6 mt-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1fr_1fr] gap-10">
          <div className="space-y-3">
            <Link href="/" className="text-primary text-sm font-medium hover:underline block">Home</Link>
            <Link href="/events" className="text-primary text-sm font-medium hover:underline block">Events</Link>
            <Link href="/challenges" className="text-primary text-sm font-medium hover:underline block">Challenges</Link>
            <Link href="/signup" className="text-primary text-sm font-medium hover:underline block">Contact Us</Link>
          </div>
          <div className="space-y-3">
            <Link href="/team" className="text-primary text-sm font-medium hover:underline block">Leadership</Link>
            <Link href="/projects" className="text-primary text-sm font-medium hover:underline block">Projects</Link>
            <Link href="/gallery" className="text-primary text-sm font-medium hover:underline block">Gallery</Link>
            <Link href="/blog" className="text-primary text-sm font-medium hover:underline block">Blog</Link>
          </div>
          <div>
            <p className="font-semibold text-heading text-sm mb-3">Contact us via:</p>
            <a href="mailto:bruteforce@university.edu" className="text-primary text-sm hover:underline">
              bruteforce@university.edu
            </a>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" aria-label="LinkedIn" className="text-heading hover:text-primary transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-heading hover:text-primary transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
            <p className="mt-8 text-xs text-muted leading-relaxed max-w-sm">
              Brute Force is the official tech club of the university, open to all students and registered members.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
