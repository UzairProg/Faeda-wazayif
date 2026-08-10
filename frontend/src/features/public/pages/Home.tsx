import { Button } from "@/components/ui/button"

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
        Find Your Next <span className="text-primary">Dream Job</span>
      </h1>
      <p className="max-w-2xl text-xl text-muted-foreground mb-8">
        Discover premium opportunities in top tech companies with AI-matched recommendations.
      </p>
      <div className="flex gap-4">
        <Button size="lg" className="rounded-full">Get Started</Button>
        <Button size="lg" variant="outline" className="rounded-full">Post a Job</Button>
      </div>
    </div>
  )
}
