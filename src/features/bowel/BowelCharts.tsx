import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from 'recharts'
import type { BowelEntry } from '@/store/types'
import type { ViewMode } from '@/components/ViewToggle'
import { format } from 'date-fns'

interface Props { entries: BowelEntry[]; view: ViewMode }

export function BowelCharts({ entries, view }: Props) {
  const typeCount: Record<string, number> = {}
  entries.forEach((e) => { typeCount[e.stoolType] = (typeCount[e.stoolType] ?? 0) + 1 })
  const typeData = Object.entries(typeCount).map(([name, count]) => ({ name, count }))

  const daily = [...entries].reverse().slice(-30).map((e) => ({
    date: format(new Date(e.createdAt), 'MMM d'),
    count: 1,
    type: e.stoolType,
  }))

  const tooltipStyle = {
    contentStyle: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 },
    labelStyle: { color: 'var(--text)' },
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <p className="text-xs text-[var(--text-muted)] mb-3">By stool type</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={typeData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="count" fill="var(--bowel-color)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <p className="text-xs text-[var(--text-muted)] mb-3">Last 30 entries</p>
        <ResponsiveContainer width="100%" height={180}>
          {view === 'bar' ? (
            <BarChart data={daily} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="var(--bowel-color)" radius={[4,4,0,0]} />
            </BarChart>
          ) : (
            <LineChart data={daily} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="count" stroke="var(--bowel-color)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
