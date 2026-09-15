import { Trophy, Clock, Play, BookOpen, Users } from "lucide-react"
import { CircularProgress } from "@/components/ui/circular-progress"

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

interface CourseSidebarProps {
  totalDuration: number
  moduleCount: number
  studentCount: number | null
}

export function CourseSidebar({ totalDuration, moduleCount, studentCount }: CourseSidebarProps) {
  return (
    <div className="sticky top-24 space-y-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex justify-center">
          <CircularProgress value={35} />
        </div>

        <div className="mt-6 rounded-lg bg-primary-accent/5 p-4">
          <div className="flex items-center gap-2 text-body-large font-semibold text-primary-500 font-poppins">
            <Trophy className="h-5 w-5 text-primary-accent" />
            Keep going!
          </div>
          <p className="mt-1 text-body leading-body text-neutral-500">
            You&apos;re doing great. Finish the next lesson to stay on track.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 text-body">
          <Clock className="h-5 w-5 text-primary-accent" />
          <div>
            <div className="text-small text-neutral-500">Duration</div>
            <div className="font-medium text-primary-500">{formatDuration(totalDuration)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-body">
          <Play className="h-5 w-5 text-primary-accent" />
          <div>
            <div className="text-small text-neutral-500">Video Lectures</div>
            <div className="font-medium text-primary-500">{moduleCount} modules</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-body">
          <BookOpen className="h-5 w-5 text-primary-accent" />
          <div>
            <div className="text-small text-neutral-500">Total Modules</div>
            <div className="font-medium text-primary-500">{moduleCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-body">
          <Users className="h-5 w-5 text-primary-accent" />
          <div>
            <div className="text-small text-neutral-500">Students Enrolled</div>
            <div className="font-medium text-primary-500">
              {studentCount ? `${(studentCount / 1000).toFixed(1)}k` : "0"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
