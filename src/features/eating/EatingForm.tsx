import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSettingsStore } from '@/store/settings'
import type { EatingEntry, FoodItem } from '@/store/types'

interface EatingFormProps {
  initial?: Partial<EatingEntry>
  onSubmit: (data: { mealTime: string; foods: FoodItem[]; note: string }) => void
  onCancel: () => void
  submitLabel?: string
}

function emptyFood(): FoodItem {
  return { name: '', grams: null }
}

export function EatingForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }: EatingFormProps) {
  const { customMealTimes } = useSettingsStore()
  const [mealTime, setMealTime] = useState(initial?.mealTime ?? customMealTimes[0])
  const [foods, setFoods] = useState<FoodItem[]>(
    initial?.foods?.length ? initial.foods : [emptyFood()]
  )
  const [note, setNote] = useState(initial?.note ?? '')

  function updateFood(index: number, patch: Partial<FoodItem>) {
    setFoods((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)))
  }

  function addFood() {
    setFoods((prev) => [...prev, emptyFood()])
  }

  function removeFood(index: number) {
    setFoods((prev) => prev.filter((_, i) => i !== index))
  }

  const totalGrams = foods.reduce((sum, f) => sum + (f.grams ?? 0), 0)
  const isValid = foods.some((f) => f.name.trim())

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
        <div className="flex items-center justify-between mb-2">
          <Label>Foods</Label>
          {totalGrams > 0 && (
            <span className="text-xs text-[var(--text-muted)]">Total: {totalGrams}g</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {foods.map((food, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={food.name}
                onChange={(e) => updateFood(i, { name: e.target.value })}
                placeholder="Food name"
                className="flex-1"
              />
              <Input
                type="number"
                value={food.grams ?? ''}
                onChange={(e) => updateFood(i, { grams: e.target.value ? Number(e.target.value) : null })}
                placeholder="g"
                className="w-20 shrink-0"
                min={0}
              />
              {foods.length > 1 && (
                <Button
                  variant="ghost" size="icon"
                  className="shrink-0 text-[var(--text-muted)] hover:text-[var(--destructive)]"
                  onClick={() => removeFood(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" className="mt-2 gap-1.5" onClick={addFood}>
          <Plus className="h-3.5 w-3.5" />
          Add food
        </Button>
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
        <Button onClick={() => onSubmit({ mealTime, foods: foods.filter((f) => f.name.trim()), note })} disabled={!isValid}>
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
