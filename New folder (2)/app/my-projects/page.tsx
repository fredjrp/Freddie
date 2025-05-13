"use client"

type ProjectType = {
  id: string
  title: string
  category: string
  description: string
  fundingGoal: number
  images: string[]
  status: string
  createdAt: any
}

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<ProjectType[]

Let's update the navbar with the new name and title:

```typescriptreact file="components/navbar.tsx"
[v0-no-op-code-block-prefix]"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, User, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/90 dark:bg-navy-900/90 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium">Investor</span>
            <span className="text-sm font-medium">Freddie</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/projects"
            className={cn(
              "text-sm font-medium transition-colors hover:text-accent",
              pathname === "/projects" ? "text-accent" : "text-muted-foreground",
            )}
          >
            Projects
          </Link>
          <Link
            href="/about"
            className={cn(
              "text-sm font-medium transition-colors hover:text-accent",
              pathname === "/about" ? "text-accent" : "text-muted-foreground",
            )}
          >
            About
          </Link>
          <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full">
            <Link href="/submit-project">Submit Project</Link>
          </Button>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">{user.displayName || user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-projects">My Projects</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">Investor</span>
                    <span className="text-sm font-medium">Freddie</span>
                  </div>
                </div>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetTrigger>
              </div>
              <nav className="flex flex-col gap-4 py-6">
                <Link
                  href="/projects"
                  className={cn(
                    "text-base font-medium transition-colors hover:text-accent",
                    pathname === "/projects" ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  Projects
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    "text-base font-medium transition-colors hover:text-accent",
                    pathname === "/about" ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  About
                </Link>
                <Link
                  href="/submit-project"
                  className={cn(
                    "text-base font-medium transition-colors hover:text-accent",
                    pathname === "/submit-project" ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  Submit Project
                </Link>
              </nav>
              <div className="mt-auto flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium">{user.displayName || user.email}</div>
                    <Button variant="outline" asChild>
                      <Link href="/profile">Profile</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/my-projects">My Projects</Link>
                    </Button>
                    {isAdmin && (
                      <Button variant="outline" asChild>
                        <Link href="/admin">Admin Dashboard</Link>
                      </Button>
                    )}
                    <Button variant="destructive" onClick={() => logout()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
