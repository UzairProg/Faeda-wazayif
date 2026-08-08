import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"

/**
 * PublicLayout — The shell for all public/guest-facing routes.
 * Contains: Public Navbar → Main Content → Public Footer
 */
export function PublicLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

// Backward-compat alias — prefer PublicLayout in new code
export const MainLayout = PublicLayout
