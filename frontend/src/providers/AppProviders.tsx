import { QueryProvider } from "./QueryProvider"
import { ThemeProvider } from "./ThemeProvider"
import { RTLProvider } from "./RTLProvider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <RTLProvider>{children}</RTLProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
