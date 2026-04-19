import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { WellnessEntry } from '@/store/types'
import { cn } from '@/lib/utils'

const MIND_LABELS = ['', 'Very cloudy', 'Cloudy', 'Neutral', 'Clear', 'Crystal clear']
const ENERGY_LABELS = ['', 'Exhausted', 'Low', 'Moderate', 'Good', 'Excellent']

function RatingRow({ label, value, onChange, labels }: {
  label: string; value: number; onChange: (v: number) => void; labels: string[]
}) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="flex gap-2">
        {([1, 2, 3, 4, 5] as const).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            title={labels[n]}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 rounded-lg border py-2 text-xs transition-colors',
              value === n
                ? 'border-[var(--primary)] bg-[var(--bg-subtle)] text-[var(--text)]'
                : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]'
            )}
          >
            <span className="text-base">{['😴','😔','😐','😊','🌟'][n-1]}</span>
            <span>{n}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-[var(--text-muted)] mt-1">{labels[value]}</p>
    </div>
  )
}

interface WellnessFormProps {
  initial?: Partial<WellnessEntry>
  onSubmit: (data: { mindClarity: WellnessEntry['mindClarity']; energy: WellnessEntry['energy']; note: string }) => void
  onCancel: () => void
  submitLabel?: string
}

export function WellnessForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }: WellnessFormProps) {
  const [mindClarity, setMindClarity] = useState<WellnessEntry['mindClarity']>((initial?.mindClarity ?? 3) as WellnessEntry['mindClarity'])
  const [energy, setEnergy] = useState<WellnessEntry['energy']>((initial?.energy ?? 3) as WellnessEntry['energy'])
  const [note, setNote] = useState(initial?.note ?? '')

  return (
    <div className="flex flex-col gap-4">
      <RatingRow label="Mind Clarity" value={mindClarity} onChange={(v) => setMindClarity(v as WellnessEntry['mindClarity'])} labels={MIND_LABELS} />
      <RatingRow label="Energy Level" value={energy} onChange={(v) => setEnergy(v as WellnessEntry['energy'])} labels={ENERGY_LABELS} />
      <div>
        <Label htmlFor="wellness-note" className="mb-1.5 block">Note (optional)</Label>
        <Textarea id="wellness-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Any additional notes…" rows={3} />
      </div>
      <div className="flex gap-2 justify-end pt-1">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit({ mindClarity, energy, note })}>{submitLabel}</Button>
      </div>
    </div>
  )
}
