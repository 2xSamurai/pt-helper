import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Task, TaskRepeat, RepeatType, CustomFrequency } from '@/store/types'

interface TaskFormProps {
  initial?: Partial<Task>
  parentId?: string | null
  onSubmit: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
  submitLabel?: string
}

const REPEAT_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: 'never', label: 'Never' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays (Mon–Fri)' },
  { value: 'weekends', label: 'Weekends (Sat–Sun)' },
  { value: 'custom', label: 'Custom' },
]

const FREQ_OPTIONS: { value: CustomFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'every-x-days', label: 'Every X days' },
]

export function TaskForm({ initial, parentId = null, onSubmit, onCancel, submitLabel = 'Save' }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [repeatType, setRepeatType] = useState<RepeatType>(initial?.repeat?.type ?? 'never')
  const [startDate, setStartDate] = useState(initial?.repeat?.startDate ?? '')
  const [endDate, setEndDate] = useState(initial?.repeat?.endDate ?? '')
  const [customFreq, setCustomFreq] = useState<CustomFrequency>(initial?.repeat?.customFrequency ?? 'daily')
  const [customX, setCustomX] = useState(String(initial?.repeat?.customEveryXDays ?? 2))
  const [reminderTime, setReminderTime] = useState(initial?.reminderTime ?? '')

  function buildRepeat(): TaskRepeat {
    return {
      type: repeatType,
      startDate: repeatType !== 'never' ? startDate || undefined : undefined,
      endDate: repeatType !== 'never' ? endDate || undefined : undefined,
      customFrequency: repeatType === 'custom' ? customFreq : undefined,
      customEveryXDays: repeatType === 'custom' && customFreq === 'every-x-days' ? Number(customX) : undefined,
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="task-title" className="mb-1.5 block">Title</Label>
        <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
      </div>

      <div>
        <Label htmlFor="task-desc" className="mb-1.5 block">Description (optional)</Label>
        <Textarea id="task-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details…" rows={3} />
      </div>

      <div>
        <Label className="mb-1.5 block">Repeat</Label>
        <Select value={repeatType} onValueChange={(v) => setRepeatType(v as RepeatType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {REPEAT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {repeatType !== 'never' && (
        <div className="flex gap-3">
          <div className="flex-1">
            <Label className="mb-1.5 block text-xs">Start date (optional)</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="flex-1">
            <Label className="mb-1.5 block text-xs">End date (optional)</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      )}

      {repeatType === 'custom' && (
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Label className="mb-1.5 block text-xs">Frequency</Label>
            <Select value={customFreq} onValueChange={(v) => setCustomFreq(v as CustomFrequency)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FREQ_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {customFreq === 'every-x-days' && (
            <div className="w-20">
              <Label className="mb-1.5 block text-xs">Every X</Label>
              <Input type="number" min={1} value={customX} onChange={(e) => setCustomX(e.target.value)} />
            </div>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="reminder-time" className="mb-1.5 block">
          Reminder time
          {repeatType !== 'never' && <span className="text-[var(--text-muted)] font-normal ml-1">(repeats on scheduled days)</span>}
        </Label>
        <Input
          id="reminder-time"
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
        />
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          disabled={!title.trim()}
          onClick={() => onSubmit({
            title,
            description,
            repeat: buildRepeat(),
            reminderTime: reminderTime || null,
            completed: initial?.completed ?? false,
            completionHistory: initial?.completionHistory ?? [],
            lastResetDate: initial?.lastResetDate ?? null,
            parentId: initial?.parentId ?? parentId,
          })}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
