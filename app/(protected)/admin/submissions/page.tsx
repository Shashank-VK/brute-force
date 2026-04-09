import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExternalLink, Github, Code2, Check, X } from "lucide-react"

const pendingSubmissions = [
  {
    id: "sub-1",
    user: "Marcus Johnson",
    challenge: "Build the Brute Force Hero",
    githubUrl: "https://github.com/marcusj/brute-force-hero",
    liveUrl: "https://brute-force-hero-marcusj.vercel.app",
    submittedAt: "2 hours ago",
    points: 500,
  },
  {
    id: "sub-2",
    user: "Elena Rodriguez",
    challenge: "Centering a Div",
    githubUrl: "https://github.com/elenar/center-div",
    liveUrl: "https://codepen.io/elenar/full/center-div",
    submittedAt: "5 hours ago",
    points: 50,
  },
]

export default function SubmissionsPage() {
  const activeSubmission = pendingSubmissions[0];

  return (
    <div className="h-full flex flex-col">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-bold text-heading">
          Submissions Review
        </h1>
        <Badge variant="default" className="font-mono">48 Pending</Badge>
      </div>

      <div className="flex-1 grid lg:grid-cols-[1fr_400px] gap-6 min-h-[600px]">

        {/* Left Pane: Preview */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-mono text-primary flex items-center gap-2">
              <Code2 className="h-4 w-4" /> Live Preview
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-muted hover:text-heading">
              Open in new tab <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative bg-hover-bg">
            <div className="absolute inset-0 w-full h-full flex items-center justify-center text-muted flex-col gap-4">
              <ExternalLink className="h-12 w-12 opacity-20" />
              <p className="font-mono text-sm">Preview: {activeSubmission.liveUrl}</p>
            </div>
          </CardContent>
        </Card>

        {/* Right Pane: Grading */}
        <div className="space-y-6 overflow-y-auto">

          <Card>
            <CardHeader className="pb-4">
              <Badge variant="outline" className="w-fit mb-2">{activeSubmission.submittedAt}</Badge>
              <CardTitle className="text-xl">{activeSubmission.challenge}</CardTitle>
              <p className="text-sm text-muted mt-1">Submitted by <span className="text-primary font-medium">{activeSubmission.user}</span></p>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-2">
                <a href={activeSubmission.githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group">
                  <div className="flex items-center gap-3 text-sm text-heading">
                    <Github className="h-4 w-4 text-muted group-hover:text-heading transition-colors" />
                    Repository
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted group-hover:text-primary transition-colors" />
                </a>
              </div>

              <div className="pt-4 border-t border-border space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted uppercase tracking-wider">Points to Award</label>
                  <Input type="number" defaultValue={activeSubmission.points} className="font-mono text-lg font-bold text-primary" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted uppercase tracking-wider">Feedback (Optional)</label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 resize-none transition-colors"
                    placeholder="Great use of animations! However..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="outline" className="text-error border-error/20 hover:bg-error/5 hover:border-error/40">
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                  <Button className="bg-success text-white hover:bg-success/90">
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3 px-4 border-b border-border">
              <CardTitle className="text-sm font-medium text-muted">Queue (Next Up)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {pendingSubmissions.slice(1).map((sub) => (
                <div key={sub.id} className="p-3 border-b border-border last:border-0 hover:bg-hover-bg cursor-pointer transition-colors">
                  <p className="text-sm font-semibold text-heading truncate">{sub.challenge}</p>
                  <p className="text-xs text-muted">{sub.user}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
