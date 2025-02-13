
import { formatDistanceToNow } from "date-fns"
import { MoreVertical, Play, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface Project {
  id: string
  fileName: string
  thumbnail: string
  quantity: number
  date: string
  status: "completed" | "processing" | "failed"
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="w-fit min-h-full group relative gap-4 rounded-xl bg-card p-4 hover:bg-accent/50 transition-colors">
      <div className="my-auto relative w-64 h-56 flex-shrink-0">
        <img
          src={project.thumbnail || "/placeholder.svg"}
          alt={project.fileName}
          className="absolute inset-0 h-full w-full rounded-md object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-white">
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{project.fileName}</h3>
            <p className="text-sm text-muted-foreground">
              {project.quantity} video{project.quantity > 1 ? "s" : ""} generated
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Download all</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-700 text-muted-foreground">
          <span>{formatDistanceToNow(new Date(project.date), { addSuffix: true })}</span>
          <span>•</span>
          <span
            className={
              project.status === "completed"
                ? "text-green-500"
                : project.status === "processing"
                  ? "text-blue-500"
                  : "text-destructive"
            }
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  )
}