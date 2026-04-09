"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Terminal, Menu, X, ChevronDown, Bell } from "lucide-react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

type Role = "ADMIN" | "MEMBER" | null

type NavbarUser = {
  id: string
  email: string | null
  fullName: string | null
}

type MeResponse = {
  user: NavbarUser | null
  role: Role
}

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<NavbarUser | null>(null)
  const [role, setRole] = useState<Role>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [showDemoOptions, setShowDemoOptions] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  const loadUserState = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" })
      if (!response.ok) {
        setUser(null)
        setRole(null)
        return
      }

      const data = (await response.json()) as MeResponse
      setUser(data.user)
      setRole(data.role)
    } catch {
      setUser(null)
      setRole(null)
    } finally {
      setAuthChecked(true)
    }
  }, [])

  useEffect(() => {
    void loadUserState()
  }, [loadUserState, pathname])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void loadUserState()
      } else {
        setUser(null)
        setRole(null)
        setAuthChecked(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [loadUserState, supabase.auth])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    setAuthChecked(true)
    window.location.href = "/"
  }

  const closeMenus = () => {
    setShowDemoOptions(false)
    setIsMobileMenuOpen(false)
  }

  const destinationHref = role === "ADMIN" ? "/admin" : "/dashboard"
  const destinationLabel = role === "ADMIN" ? "Open Admin" : "Open Dashboard"
  const roleLabel = role === "ADMIN" ? "Admin" : "Member"

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Challenges", href: "/challenges" },
    { name: "Projects", href: "/projects" },
    { name: "Gallery", href: "/gallery" },
    { name: "Team", href: "/team" },
    { name: "Blog", href: "/blog" },
    { name: "Leaderboard", href: "/leaderboard" },
  ]

  if (pathname?.startsWith("/login") || pathname?.startsWith("/signup") || pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-base/90 backdrop-blur-lg shadow-nav border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Terminal className="h-5 w-5 text-primary transition-colors" />
          <span className="font-display font-bold text-lg tracking-wide text-heading group-hover:text-primary transition-colors">
            BRUTE FORCE
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                pathname === link.href
                  ? "text-primary bg-primary/5"
                  : "text-body hover:text-heading hover:bg-hover-bg"
              }`}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Right: Auth + Social */}
        <div className="hidden md:flex items-center gap-3">
          {/* Notification Bell */}
          {user ? (
            <button className="relative p-2 text-muted hover:text-heading transition-colors rounded-lg hover:bg-hover-bg" aria-label="Session active">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-success" />
            </button>
          ) : null}

          {!authChecked ? (
            <Button size="default" variant="outline" disabled>
              Checking session...
            </Button>
          ) : user ? (
            <>
              <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                {roleLabel}
              </span>
              <Link href={destinationHref}>
                <Button size="default">{destinationLabel}</Button>
              </Link>
              <Button variant="outline" size="default" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          ) : (
            <div className="relative">
              <Button
                onClick={() => setShowDemoOptions(!showDemoOptions)}
                size="default"
              >
                Sign In <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>

              {showDemoOptions && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-surface border border-border shadow-card-hover overflow-hidden">
                  <div className="py-1">
                    <Link href="/login?mode=student" onClick={closeMenus} className="block w-full text-left px-4 py-2.5 text-sm text-heading hover:bg-hover-bg font-medium border-b border-border">
                      Student Sign In
                    </Link>
                    <Link href="/login?mode=admin" onClick={closeMenus} className="block w-full text-left px-4 py-2.5 text-sm text-heading hover:bg-hover-bg font-medium border-b border-border">
                      Admin Sign In
                    </Link>
                    <Link href="/signup?mode=student" onClick={closeMenus} className="block w-full text-left px-4 py-2.5 text-sm text-heading hover:bg-hover-bg border-b border-border">
                      Create Student Account
                    </Link>
                    <Link href="/signup?mode=admin" onClick={closeMenus} className="block w-full text-left px-4 py-2.5 text-sm text-heading hover:bg-hover-bg border-b border-border">
                      Create Admin Account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Social Icons */}
          <div className="flex items-center gap-2 ml-1 pl-3 border-l border-border">
            <a href="#" aria-label="LinkedIn" className="text-body hover:text-primary transition-colors p-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="text-body hover:text-primary transition-colors p-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-heading" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-base border-b border-border p-4 shadow-card">
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenus}
                className={`text-sm font-medium p-2.5 rounded-lg ${
                  pathname === link.href ? "bg-primary/5 text-primary" : "text-body hover:bg-hover-bg hover:text-heading"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 pt-3 border-t border-border">
            {authChecked && user ? (
              <>
                <Link href={destinationHref} onClick={closeMenus}>
                  <Button variant="ghost" className="w-full">{destinationLabel}</Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="w-full text-muted hover:text-error">
                  Sign out current session
                </Button>
              </>
            ) : (
              <>
                <Link href="/login?mode=student" onClick={closeMenus}>
                  <Button variant="outline" className="w-full">Student Sign In</Button>
                </Link>
                <Link href="/login?mode=admin" onClick={closeMenus}>
                  <Button variant="outline" className="w-full">Admin Sign In</Button>
                </Link>
                <Link href="/signup?mode=student" onClick={closeMenus}>
                  <Button variant="outline" className="w-full">Create Student Account</Button>
                </Link>
                <Link href="/signup?mode=admin" onClick={closeMenus}>
                  <Button className="w-full">Create Admin Account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
