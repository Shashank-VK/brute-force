import Link from "next/link";
import { Activity, Users, Calendar, Trophy, Image as ImageIcon, Database, ShieldAlert, FolderGit2, Terminal } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: "Overview", href: "/admin", icon: Activity },
    { name: "Submissions", href: "/admin/submissions", icon: ShieldAlert },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Challenges", href: "/admin/challenges", icon: Trophy },
    { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Audit Logs", href: "/admin/audit", icon: Database },
  ];

  return (
    <div className="flex h-screen bg-base text-body font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="inline-flex items-center gap-2 group" aria-label="Go to homepage">
            <Terminal className="h-5 w-5 text-primary transition-colors" />
            <span className="font-display font-bold text-lg tracking-wide text-heading group-hover:text-primary transition-colors">
              BRUTE FORCE
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-body hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border text-xs text-muted text-center">
          Brute Force Admin
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
