import { Link } from 'react-router-dom'
import { Activity, Droplets, Brain, UtensilsCrossed, Bell, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { useSettingsStore } from '@/store/settings'
import { useBloatingStore } from '@/store/bloating'
import { useBowelStore } from '@/store/bowel'
import { useWellnessStore } from '@/store/wellness'
import { useEatingStore } from '@/store/eating'
import { useRemindersStore } from '@/store/reminders'
import { BLOATING_LABELS } from '@/store/types'
import { formatDateTime } from '@/lib/utils'

const SECTIONS = [
  {
    id: 'bloating',
    label: 'Bloating',
    Icon: Activity,
    color: 'var(--bloating-color)',
    href: '/trackers/bloating',
  },
  {
    id: 'bowel',
    label: 'Bowel Movement',
    Icon: Droplets,
    color: 'var(--bowel-color)',
    href: '/trackers/bowel',
  },
  {
    id: 'wellness',
    label: 'Wellness',
    Icon: Brain,
    color: 'var(--wellness-color)',
    href: '/trackers/wellness',
  },
  {
    id: 'eating',
    label: 'Eating',
    Icon: UtensilsCrossed,
    color: 'var(--eating-color)',
    href: '/trackers/eating',
  },
  {
    id: 'reminders',
    label: 'Reminders',
    Icon: Bell,
    color: 'var(--reminder-color)',
    href: '/reminders',
  },
]

function SectionSummary({ id }: { id: string }) {
  const bloating = useBloatingStore()
  const bowel = useBowelStore()
  const wellness = useWellnessStore()
  const eating = useEatingStore()
  const reminders = useRemindersStore()

  if (id === 'bloating') {
    const latest = bloating.entries[0]
    return latest
      ? <p className="text-xs text-[var(--text-muted)] mt-0.5">Last: {BLOATING_LABELS[latest.level]} · {formatDateTime(latest.createdAt)}</p>
      : <p className="text-xs text-[var(--text-muted)] mt-0.5">No entries yet</p>
  }
  if (id === 'bowel') {
    const latest = bowel.entries[0]
    return latest
      ? <p className="text-xs text-[var(--text-muted)] mt-0.5">Last: {latest.stoolType} · {formatDateTime(latest.createdAt)}</p>
      : <p className="text-xs text-[var(--text-muted)] mt-0.5">No entries yet</p>
  }
  if (id === 'wellness') {
    const latest = wellness.entries[0]
    return latest
      ? <p className="text-xs text-[var(--text-muted)] mt-0.5">Mind {latest.mindClarity}/5 · Energy {latest.energy}/5</p>
      : <p className="text-xs text-[var(--text-muted)] mt-0.5">No entries yet</p>
  }
  if (id === 'eating') {
    const latest = eating.entries[0]
    return latest
      ? <p className="text-xs text-[var(--text-muted)] mt-0.5">Last: {latest.foods[0]?.name ?? '—'} ({latest.mealTime})</p>
      : <p className="text-xs text-[var(--text-muted)] mt-0.5">No entries yet</p>
  }
  if (id === 'reminders') {
    const pending = reminders.tasks.filter((t) => !t.completed).length
    return <p className="text-xs text-[var(--text-muted)] mt-0.5">{pending} pending task{pending !== 1 ? 's' : ''}</p>
  }
  return null
}

export function Home() {
  const { hiddenSections } = useSettingsStore()
  const visible = SECTIONS.filter((s) => !hiddenSections.includes(s.id))

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="PT Helper" />
      <div className="flex-1 p-4 mb-nav">
        <p className="text-xs text-[var(--text-muted)] mb-4">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex flex-col gap-3">
          {visible.map(({ id, label, Icon, color, href }) => (
            <Link key={id} to={href}>
              <Card className="active:opacity-70 transition-opacity">
                <CardContent className="pt-4 pb-4 flex items-center gap-3">
                  <div
                    className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center"
                    style={{ background: color }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text)]">{label}</p>
                    <SectionSummary id={id} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-16 text-[var(--text-muted)] text-sm">
            All sections hidden. Enable them in Settings.
          </div>
        )}
      </div>
    </div>
  )
}
