import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from 'recharts'
import type { EatingEntry } from '@/store/types'
import type { ViewMode } from '@/components/ViewToggle'
import { format } from 'date-fns'

interface Props { entries: EatingEntry[]; view: ViewMode }

function entryTotalGrams(e: EatingEntry): number {
  return e.foods.reduce((s, f) => s + (f.grams ?? 0), 0)
}

export function EatingCharts({ entries, view }: Props) {
  const mealCount: Record<string, number> = {}
  entries.forEach((e) => { mealCount[e.mealTime] = (mealCount[e.mealTime] ?? 0) + 1 })
  const mealData = Object.entries(mealCount).map(([name, count]) => ({ name, count }))

  const daily = [...entries].reverse().slice(-30).map((e) => ({
    date: format(new Date(e.createdAt), 'MMM d'),
    grams: entryTotalGrams(e),
  }))

  const tooltip = {
    contentStyle: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 },
    labelStyle: { color: 'var(--text)' },
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <p className="text-xs text-[var(--text-muted)] mb-3">By meal type</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={mealData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <Tooltip {...tooltip} />
            <Bar dataKey="count" fill="var(--eating-color)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <p className="text-xs text-[var(--text-muted)] mb-3">Total portion per entry (g)</p>
        <ResponsiveContainer width="100%" height={180}>
          {view === 'bar' ? (
            <BarChart data={daily} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip {...tooltip} />
              <Bar dataKey="grams" fill="var(--eating-color)" radius={[4,4,0,0]} />
            </BarChart>
          ) : (
            <LineChart data={daily} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip {...tooltip} />
              <Line type="monotone" dataKey="grams" stroke="var(--eating-color)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
