import { List, BarChart2, LineChart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type ViewMode = 'list' | 'bar' | 'line'

const VIEWS: { mode: ViewMode; Icon: typeof List; label: string }[] = [
  { mode: 'list', Icon: List, label: 'List' },
  { mode: 'bar', Icon: BarChart2, label: 'Bar' },
  { mode: 'line', Icon: LineChart, label: 'Line' },
]

interface ViewToggleProps {
  current: ViewMode
  onChange: (v: ViewMode) => void
}

export function ViewToggle({ current, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-[var(--bg-subtle)] p-1">
      {VIEWS.map(({ mode, Icon, label }) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          title={label}
          className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
            current === mode
              ? 'bg-[var(--bg-card)] text-[var(--text)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}

export { Button }
