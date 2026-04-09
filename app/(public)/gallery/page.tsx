"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";

const photoCategories = ["Hackathon", "Workshop", "Social", "Talk", "Showcase"] as const;

const photos = Array.from({ length: 21 }, (_, index) => {
  const id = index + 1;
  return {
    id,
    src: `/gallery/club-photo-${String(id).padStart(2, "0")}.jpeg`,
    alt: `Brute Force club event photo ${id}`,
    title: `Club memory #${id}`,
    category: photoCategories[index % photoCategories.length],
  };
});

const categories = ["All", "Hackathon", "Workshop", "Social", "Talk", "Showcase"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const filtered = activeCategory === "All" ? photos : photos.filter((p) => p.category === activeCategory);
  const activePhoto = selectedPhoto === null ? null : photos.find((p) => p.id === selectedPhoto);

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
          {filtered.map((photo) => (
            <StaggerItem key={photo.id}>
              <button
                onClick={() => setSelectedPhoto(photo.id)}
                className="w-full text-left group"
              >
                <Card className="overflow-hidden h-full">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-heading/0 group-hover:bg-heading/5 transition-colors duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-heading text-sm mb-1 group-hover:text-primary transition-colors">{photo.title}</h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{photo.category}</Badge>
                      <span className="text-xs text-muted">Photo #{photo.id}</span>
                    </div>
                  </div>
                </Card>
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Lightbox Overlay */}
      {selectedPhoto !== null && activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-heading/50 backdrop-blur-sm p-6">
          <div className="relative bg-surface rounded-2xl shadow-float max-w-2xl w-full p-8">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-muted hover:text-heading hover:bg-hover-bg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </div>
              <h2 className="text-2xl font-bold text-heading mb-2">
                {activePhoto.title}
              </h2>
              <p className="text-muted">
                Category: {activePhoto.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
