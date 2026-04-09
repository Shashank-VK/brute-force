"use client";

import { useState } from "react";
import { Camera, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";

const albums = [
  { id: 1, title: "Spring Hackathon 2026", category: "Hackathon", count: 24, color: "from-primary/20 to-secondary/20" },
  { id: 2, title: "React Workshop", category: "Workshop", count: 12, color: "from-secondary/20 to-primary/20" },
  { id: 3, title: "Team Retreat", category: "Social", count: 18, color: "from-success/20 to-primary/20" },
  { id: 4, title: "Winter Code Jam", category: "Hackathon", count: 30, color: "from-warning/20 to-error/20" },
  { id: 5, title: "Guest Speaker Series", category: "Talk", count: 8, color: "from-primary/20 to-success/20" },
  { id: 6, title: "Project Demo Day", category: "Showcase", count: 15, color: "from-error/20 to-secondary/20" },
  { id: 7, title: "Orientation Week", category: "Social", count: 22, color: "from-secondary/20 to-warning/20" },
  { id: 8, title: "Cloud Workshop", category: "Workshop", count: 10, color: "from-primary/20 to-secondary/20" },
];

const categories = ["All", "Hackathon", "Workshop", "Social", "Talk", "Showcase"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);

  const filtered = activeCategory === "All" ? albums : albums.filter((a) => a.category === activeCategory);

  return (
    <main className="min-h-screen bg-base pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Gallery</p>
            <h1 className="text-4xl font-bold md:text-5xl">Moments captured</h1>
            <p className="mt-4 text-body text-lg max-w-2xl">
              Photos from our events, workshops, and community gatherings.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-hover-bg text-body hover:bg-border hover:text-heading"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4" staggerDelay={0.06}>
          {filtered.map((album) => (
            <StaggerItem key={album.id}>
              <button
                onClick={() => setSelectedAlbum(album.id)}
                className="w-full text-left group"
              >
                <Card className="overflow-hidden h-full">
                  <div className={`aspect-square bg-gradient-to-br ${album.color} flex items-center justify-center relative`}>
                    <Camera className="h-10 w-10 text-primary/30" />
                    <div className="absolute inset-0 bg-heading/0 group-hover:bg-heading/5 transition-colors duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-heading text-sm mb-1 group-hover:text-primary transition-colors">{album.title}</h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{album.category}</Badge>
                      <span className="text-xs text-muted">{album.count} photos</span>
                    </div>
                  </div>
                </Card>
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Lightbox Overlay */}
      {selectedAlbum !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-heading/50 backdrop-blur-sm p-6">
          <div className="relative bg-surface rounded-2xl shadow-float max-w-2xl w-full p-8">
            <button
              onClick={() => setSelectedAlbum(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-muted hover:text-heading hover:bg-hover-bg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className={`aspect-video rounded-xl bg-gradient-to-br ${albums.find((a) => a.id === selectedAlbum)?.color} flex items-center justify-center mb-6`}>
                <Camera className="h-16 w-16 text-primary/20" />
              </div>
              <h2 className="text-2xl font-bold text-heading mb-2">
                {albums.find((a) => a.id === selectedAlbum)?.title}
              </h2>
              <p className="text-muted">
                {albums.find((a) => a.id === selectedAlbum)?.count} photos from this event
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
