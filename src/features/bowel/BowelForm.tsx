import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSettingsStore } from '@/store/settings'
import type { BowelEntry } from '@/store/types'

interface BowelFormProps {
  initial?: Partial<BowelEntry>
  onSubmit: (data: { stoolType: string; emptiness: string; note: string }) => void
  onCancel: () => void
  submitLabel?: string
}

export function BowelForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }: BowelFormProps) {
  const { customStoolTypes, customEmptinessOptions } = useSettingsStore()
  const [stoolType, setStoolType] = useState(initial?.stoolType ?? customStoolTypes[0])
  const [emptiness, setEmptiness] = useState(initial?.emptiness ?? customEmptinessOptions[0])
  const [note, setNote] = useState(initial?.note ?? '')

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="mb-1.5 block">Stool Type</Label>
        <Select value={stoolType} onValueChange={setStoolType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {customStoolTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1.5 block">Emptiness</Label>
        <Select value={emptiness} onValueChange={setEmptiness}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {customEmptinessOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="bowel-note" className="mb-1.5 block">Note (optional)</Label>
        <Textarea
          id="bowel-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any additional notes…"
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit({ stoolType, emptiness, note })}>{submitLabel}</Button>
      </div>
    </div>
  )
}
