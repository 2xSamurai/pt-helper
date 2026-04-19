import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSettingsStore } from '@/store/settings'
import type { EatingEntry } from '@/store/types'

interface EatingFormProps {
  initial?: Partial<EatingEntry>
  onSubmit: (data: { mealTime: string; foodName: string; portionGrams: number | null; note: string }) => void
  onCancel: () => void
  submitLabel?: string
}

export function EatingForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }: EatingFormProps) {
  const { customMealTimes } = useSettingsStore()
  const [mealTime, setMealTime] = useState(initial?.mealTime ?? customMealTimes[0])
  const [foodName, setFoodName] = useState(initial?.foodName ?? '')
  const [portionGrams, setPortionGrams] = useState<string>(
    initial?.portionGrams != null ? String(initial.portionGrams) : ''
  )
  const [note, setNote] = useState(initial?.note ?? '')

  function handleSubmit() {
    onSubmit({
      mealTime,
      foodName,
      portionGrams: portionGrams ? Number(portionGrams) : null,
      note,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label className="mb-1.5 block">Meal Time</Label>
        <Select value={mealTime} onValueChange={setMealTime}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {customMealTimes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="food-name" className="mb-1.5 block">Food Name</Label>
        <Input
          id="food-name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="e.g. Oatmeal with berries"
        />
      </div>

      <div>
        <Label htmlFor="portion" className="mb-1.5 block">Portion (grams)</Label>
        <Input
          id="portion"
          type="number"
          value={portionGrams}
          onChange={(e) => setPortionGrams(e.target.value)}
          placeholder="e.g. 250"
          min={0}
        />
      </div>

      <div>
        <Label htmlFor="eat-note" className="mb-1.5 block">Note (optional)</Label>
        <Textarea
          id="eat-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any additional notes…"
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!foodName.trim()}>{submitLabel}</Button>
      </div>
    </div>
  )
}
