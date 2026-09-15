import {
  BookOpen,
  Code,
  Gauge,
  Layers,
  Puzzle,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  book: BookOpen,
  code: Code,
  gauge: Gauge,
  layers: Layers,
  puzzle: Puzzle,
  rocket: Rocket,
  shield: Shield,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  trophy: Trophy,
  workflow: Workflow,
  zap: Zap,
}

interface CourseIconProps {
  name: string | null
  size?: number
  className?: string
}

export function CourseIcon({ name, size = 24, className }: CourseIconProps) {
  if (!name) return null
  const Icon = iconMap[name]
  if (!Icon) return null
  return <Icon size={size} className={className} />
}
