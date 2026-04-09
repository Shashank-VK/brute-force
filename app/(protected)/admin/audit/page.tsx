import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

const auditLogs = [
  { id: 1, timestamp: "2026-04-09 14:32:10", admin: "Marcus Johnson", action: "APPROVE_SUBMISSION", target: "Elena Rodriguez — Build the Brute Force Hero", details: "Awarded 500 points" },
  { id: 2, timestamp: "2026-04-09 13:15:45", admin: "Marcus Johnson", action: "CREATE_EVENT", target: "Spring Hackathon 2026", details: "Capacity: 100, Date: 2026-04-20" },
  { id: 3, timestamp: "2026-04-09 11:22:30", admin: "Marcus Johnson", action: "UPDATE_CHALLENGE", target: "REST API Design", details: "Points changed: 150 → 200" },
  { id: 4, timestamp: "2026-04-08 16:45:00", admin: "Admin", action: "REJECT_SUBMISSION", target: "Omar Hassan — Centering a Div", details: "Feedback: Incomplete implementation" },
  { id: 5, timestamp: "2026-04-08 10:30:15", admin: "Marcus Johnson", action: "CREATE_CHALLENGE", target: "WebSocket Chat App", details: "Difficulty: Hard, Points: 400" },
  { id: 6, timestamp: "2026-04-07 14:20:00", admin: "Admin", action: "UPDATE_USER_ROLE", target: "Marcus Johnson", details: "Role changed: member → admin" },
  { id: 7, timestamp: "2026-04-07 09:10:22", admin: "Admin", action: "CREATE_ALBUM", target: "Spring Hackathon 2026", details: "24 photos uploaded" },
  { id: 8, timestamp: "2026-04-06 17:00:00", admin: "Marcus Johnson", action: "FEATURE_PROJECT", target: "Campus Navigator", details: "Marked as featured" },
]

function ActionBadge({ action }: { action: string }) {
  if (action.startsWith("APPROVE")) return <Badge variant="success" className="text-xs font-mono">{action}</Badge>
  if (action.startsWith("REJECT")) return <Badge variant="destructive" className="text-xs font-mono">{action}</Badge>
  if (action.startsWith("CREATE")) return <Badge variant="default" className="text-xs font-mono">{action}</Badge>
  if (action.startsWith("UPDATE")) return <Badge variant="warning" className="text-xs font-mono">{action}</Badge>
  if (action.startsWith("DELETE")) return <Badge variant="destructive" className="text-xs font-mono">{action}</Badge>
  return <Badge variant="outline" className="text-xs font-mono">{action}</Badge>
}

export default function AdminAuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-heading">Audit Logs</h1>
        <Badge variant="outline" className="font-mono">{auditLogs.length} entries</Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input placeholder="Search logs..." className="pl-10" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" /> Filter Actions
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Admin</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Target</th>
                  <th className="px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border last:border-0 hover:bg-hover-bg transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-3 text-sm text-heading font-medium">{log.admin}</td>
                    <td className="px-4 py-3"><ActionBadge action={log.action} /></td>
                    <td className="px-4 py-3 text-sm text-body max-w-[200px] truncate">{log.target}</td>
                    <td className="px-4 py-3 text-xs text-muted max-w-[200px] truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
