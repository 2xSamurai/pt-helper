import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts'
import type { WellnessEntry } from '@/store/types'
import type { ViewMode } from '@/components/ViewToggle'
import { format } from 'date-fns'

interface Props { entries: WellnessEntry[]; view: ViewMode }

export function WellnessCharts({ entries, view }: Props) {
  const data = [...entries].reverse().slice(-30).map((e) => ({
    date: format(new Date(e.createdAt), 'MMM d'),
    Mind: e.mindClarity,
    Energy: e.energy,
  }))

  const tooltip = {
    contentStyle: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 },
    labelStyle: { color: 'var(--text)' },
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
      <p className="text-xs text-[var(--text-muted)] mb-3">Last 30 entries (1–5 scale)</p>
      <ResponsiveContainer width="100%" height={240}>
        {view === 'bar' ? (
          <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <YAxis domain={[0, 5]} ticks={[0,1,2,3,4,5]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <Tooltip {...tooltip} />
            <Legend />
            <Bar dataKey="Mind" fill="var(--wellness-color)" radius={[4,4,0,0]} />
            <Bar dataKey="Energy" fill="#f59e0b" radius={[4,4,0,0]} />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <YAxis domain={[0, 5]} ticks={[0,1,2,3,4,5]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <Tooltip {...tooltip} />
            <Legend />
            <Line type="monotone" dataKey="Mind" stroke="var(--wellness-color)" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Energy" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
