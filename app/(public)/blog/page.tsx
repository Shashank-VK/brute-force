import { ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { TiltCard } from "@/components/ui/tilt-card";

const featuredPost = {
  title: "How We Built Our Club Platform with Next.js 14",
  excerpt: "A deep dive into the architecture decisions, design system, and deployment pipeline behind the Brute Force platform.",
  date: "Mar 28, 2026",
  author: "Aarav Mehta",
  category: "Engineering",
  readTime: "8 min read",
};

const articles = [
  { title: "Getting Started with Rust for Web Developers", date: "Mar 20, 2026", author: "Rohan Gupta", category: "Tutorial", readTime: "6 min" },
  { title: "Our Spring Hackathon Recap", date: "Mar 15, 2026", author: "Meera Patel", category: "Events", readTime: "4 min" },
  { title: "Why TypeScript Makes You a Better Developer", date: "Mar 8, 2026", author: "Ananya Rao", category: "Opinion", readTime: "5 min" },
  { title: "Building Accessible UI Components", date: "Feb 25, 2026", author: "Sneha Iyer", category: "Tutorial", readTime: "7 min" },
  { title: "Machine Learning on the Edge: A Beginner's Guide", date: "Feb 18, 2026", author: "Priya Sharma", category: "Tutorial", readTime: "9 min" },
  { title: "How to Ace Your First Tech Interview", date: "Feb 10, 2026", author: "Karan Joshi", category: "Career", readTime: "5 min" },
];

const categoryColors: Record<string, "default" | "secondary" | "warning" | "outline"> = {
  Engineering: "default",
  Tutorial: "secondary",
  Events: "warning",
  Opinion: "outline",
  Career: "default",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-base pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Blog</p>
            <h1 className="text-4xl font-bold md:text-5xl">Stories & insights</h1>
            <p className="mt-4 text-body text-lg max-w-2xl">
              Technical tutorials, event recaps, and perspectives from Brute Force members.
            </p>
          </div>
        </ScrollReveal>

        {/* Featured Post */}
        <ScrollReveal delay={0.1}>
          <TiltCard maxTilt={3}>
            <Card className="mb-12 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-12">
                    <div className="text-6xl font-display font-bold text-primary/20">BF</div>
                  </div>
                  <div className="p-8 md:w-3/5">
                    <Badge variant={categoryColors[featuredPost.category]} className="mb-4">{featuredPost.category}</Badge>
                    <h2 className="text-2xl font-bold text-heading mb-3 md:text-3xl">{featuredPost.title}</h2>
                    <p className="text-muted leading-relaxed mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted mb-6">
                      <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{featuredPost.author}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{featuredPost.date}</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <Link href="#" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                      Read article <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TiltCard>
        </ScrollReveal>

        {/* Article Grid */}
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
          {articles.map((article) => (
            <StaggerItem key={article.title}>
              <TiltCard maxTilt={4}>
                <Card className="h-full group cursor-pointer">
                  <CardContent className="p-6">
                    <Badge variant={categoryColors[article.category]} className="mb-3">{article.category}</Badge>
                    <h3 className="text-lg font-semibold text-heading mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted">
                      <span>{article.author}</span>
                      <span className="h-1 w-1 rounded-full bg-muted" />
                      <span>{article.date}</span>
                      <span className="h-1 w-1 rounded-full bg-muted" />
                      <span>{article.readTime}</span>
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
