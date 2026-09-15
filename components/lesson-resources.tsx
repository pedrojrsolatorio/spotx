import { FileText, Video, Download, LinkIcon, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface Resource {
  _key: string
  type: "document" | "download" | "link" | "video" | null
  title: string
  description: string | null
  url: string | null
}

interface LessonResourcesProps {
  resources: Resource[]
}

const typeIcons: Record<string, typeof FileText> = {
  document: FileText,
  video: Video,
  download: Download,
  link: LinkIcon,
}

export function LessonResources({ resources }: LessonResourcesProps) {
  if (!resources.length) return null

  return (
    <div>
      <h3 className="text-xl font-bold text-primary-500 font-poppins mb-4">
        Resources
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => {
          const Icon = typeIcons[resource.type ?? "link"] ?? FileText

          return (
            <a
              key={resource._key}
              href={resource.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-neutral-100 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 group-hover:bg-primary-accent/10 group-hover:text-primary-accent transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-primary-500 mb-1 group-hover:text-primary-accent transition-colors">
                    {resource.title}
                  </h4>
                  {resource.description && (
                    <p className="text-xs text-neutral-500 line-clamp-2">
                      {resource.description}
                    </p>
                  )}
                </div>
                <ExternalLink className="h-4.5 w-4.5 shrink-0 text-neutral-300 group-hover:text-primary-accent transition-colors" />
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
