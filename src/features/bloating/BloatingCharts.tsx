import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell,
} from 'recharts'
import type { BloatingEntry } from '@/store/types'
import type { ViewMode } from '@/components/ViewToggle'
import { format } from 'date-fns'

const COLORS = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444', '#991b1b']

interface Props { entries: BloatingEntry[]; view: ViewMode }

export function BloatingCharts({ entries, view }: Props) {
  const data = [...entries]
    .reverse()
    .slice(-30)
    .map((e) => ({ date: format(new Date(e.createdAt), 'MMM d'), level: e.level }))

  const common = {
    data,
    margin: { top: 4, right: 8, bottom: 0, left: -20 },
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
      <p className="text-xs text-[var(--text-muted)] mb-3">Last 30 entries</p>
      <ResponsiveContainer width="100%" height={220}>
        {view === 'bar' ? (
          <BarChart {...common}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <YAxis domain={[0, 5]} ticks={[0,1,2,3,4,5]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
              labelStyle={{ color: 'var(--text)' }}
            />
            <Bar dataKey="level" radius={[4,4,0,0]}>
              {data.map((d, i) => <Cell key={i} fill={COLORS[d.level]} />)}
            </Bar>
          </BarChart>
        ) : (
          <LineChart {...common}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <YAxis domain={[0, 5]} ticks={[0,1,2,3,4,5]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
              labelStyle={{ color: 'var(--text)' }}
            />
            <Line type="monotone" dataKey="level" stroke="var(--bloating-color)" strokeWidth={2} dot={{ r: 4, fill: 'var(--bloating-color)' }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
