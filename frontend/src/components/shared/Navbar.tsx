import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto px-4">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-heading text-xl font-bold tracking-tight">Faeda-Jobs</span>
        </Link>
        
        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          <Link to="/jobs" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Find Jobs
          </Link>
          <Link to="/companies" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Companies
          </Link>
          <Link to="/teams" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Teams
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link to="/register">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
