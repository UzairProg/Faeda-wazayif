import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function JobList() {
  const jobs = [
    { id: 1, title: "Senior Frontend Engineer", company: "TechCorp", location: "Remote", type: "Full-time", match: 95 },
    { id: 2, title: "Product Designer", company: "CreativeStudio", location: "New York", type: "Contract", match: 88 },
    { id: 3, title: "Backend Developer", company: "DataSystems", location: "London", type: "Full-time", match: 72 },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Find Jobs</h1>
          <p className="text-muted-foreground">Discover and apply to the best jobs for your skills.</p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {jobs.map(job => (
          <Card key={job.id} className="transition-all hover:shadow-md border-border/50">
            <CardHeader className="flex flex-row justify-between items-start pb-2">
              <div>
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <CardDescription className="text-base mt-1">{job.company}</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {job.match}% Match
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Badge variant="outline">{job.location}</Badge>
                <Badge variant="outline">{job.type}</Badge>
              </div>
              <Button>Apply Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
