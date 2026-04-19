import { type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  Icon: LucideIcon
  title: string
  description?: string
}

export function EmptyState({ Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
      <div className="rounded-full bg-[var(--bg-subtle)] p-4">
        <Icon className="h-8 w-8 text-[var(--text-muted)]" />
      </div>
      <div>
        <p className="font-medium text-[var(--text)]">{title}</p>
        {description && <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>}
      </div>
    </div>
  )
}
