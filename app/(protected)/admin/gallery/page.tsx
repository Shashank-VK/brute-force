import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Image as ImageIcon, Upload, MoreHorizontal } from "lucide-react"

const albums = [
  { id: 1, title: "Spring Hackathon 2026", event: "Spring Hackathon", images: 24, cover: "from-primary/15 to-secondary/15", date: "2026-03-20" },
  { id: 2, title: "AI Workshop Series", event: "AI/ML Workshop", images: 12, cover: "from-secondary/15 to-warning/15", date: "2026-02-15" },
  { id: 3, title: "Team Photos 2025", event: null, images: 18, cover: "from-warning/15 to-primary/15", date: "2025-12-01" },
  { id: 4, title: "CTF Competition", event: "CTF Competition", images: 8, cover: "from-primary/10 to-success/15", date: "2026-03-10" },
  { id: 5, title: "Campus Events", event: null, images: 32, cover: "from-success/10 to-secondary/15", date: "2025-11-15" },
  { id: 6, title: "Design Systems Talk", event: "Design Systems Talk", images: 6, cover: "from-secondary/10 to-primary/10", date: "2026-02-28" },
]

export default function AdminGalleryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-heading">Gallery</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" /> Upload Photos
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" /> New Album
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <Card key={album.id} className="overflow-hidden cursor-pointer group">
            <div className={`h-40 bg-gradient-to-br ${album.cover} flex items-center justify-center relative`}>
              <ImageIcon className="h-10 w-10 text-muted/30" />
              <div className="absolute inset-0 bg-heading/0 group-hover:bg-heading/5 transition-colors" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-heading text-sm">{album.title}</h3>
                  {album.event && (
                    <p className="text-xs text-muted mt-0.5">Event: {album.event}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className="text-xs">{album.images} photos</Badge>
                    <span className="text-xs text-muted">{album.date}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
