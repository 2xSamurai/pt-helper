import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BLOATING_LABELS } from '@/store/types'
import type { BloatingEntry } from '@/store/types'
import { cn } from '@/lib/utils'

interface BloatingFormProps {
  initial?: Partial<BloatingEntry>
  onSubmit: (data: { level: BloatingEntry['level']; note: string }) => void
  onCancel: () => void
  submitLabel?: string
}

export function BloatingForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }: BloatingFormProps) {
  const [level, setLevel] = useState<BloatingEntry['level']>((initial?.level ?? 0) as BloatingEntry['level'])
  const [note, setNote] = useState(initial?.note ?? '')

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="mb-2 block">Bloating Level</Label>
        <div className="flex flex-col gap-2">
          {([0, 1, 2, 3, 4, 5] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2 text-sm text-left transition-colors',
                level === l
                  ? 'border-[var(--primary)] bg-[var(--bg-subtle)] text-[var(--text)]'
                  : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--text)]'
              )}
            >
              <span className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                l === 0 ? 'bg-green-500' :
                l === 1 ? 'bg-lime-500' :
                l === 2 ? 'bg-yellow-500' :
                l === 3 ? 'bg-orange-500' :
                l === 4 ? 'bg-red-500' : 'bg-red-700'
              )}>{l}</span>
              <span>{BLOATING_LABELS[l]}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="bloat-note" className="mb-1.5 block">Note (optional)</Label>
        <Textarea
          id="bloat-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any additional notes…"
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit({ level, note })}>{submitLabel}</Button>
      </div>
    </div>
  )
}
