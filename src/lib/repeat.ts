import { differenceInCalendarDays, format, addDays } from 'date-fns'
import type { TaskRepeat } from '@/store/types'

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function nextOccurrenceDate(repeat: TaskRepeat): Date | null {
  if (repeat.type === 'never') return null
  const today = new Date()
  for (let i = 0; i <= 365; i++) {
    const d = addDays(new Date(today.getFullYear(), today.getMonth(), today.getDate()), i)
    if (isRepeatDay(repeat, d)) return d
  }
  return null
}

export function isRepeatDay(repeat: TaskRepeat, date: Date = new Date()): boolean {
  const { type, startDate, endDate, customFrequency, customEveryXDays } = repeat
  if (type === 'never') return false

  const dateStr = format(date, 'yyyy-MM-dd')
  if (startDate && dateStr < startDate) return false
  if (endDate && dateStr > endDate) return false

  const dow = date.getDay() // 0=Sun 6=Sat
  if (type === 'daily') return true
  if (type === 'weekdays') return dow >= 1 && dow <= 5
  if (type === 'weekends') return dow === 0 || dow === 6
  if (type === 'custom') {
    if (!customFrequency) return false
    if (customFrequency === 'daily') return true
    if (customFrequency === 'weekly') {
      if (!startDate) return false
      const diff = differenceInCalendarDays(date, new Date(startDate))
      return diff >= 0 && diff % 7 === 0
    }
    if (customFrequency === 'every-x-days') {
      if (!startDate || !customEveryXDays) return false
      const diff = differenceInCalendarDays(date, new Date(startDate))
      return diff >= 0 && diff % customEveryXDays === 0
    }
  }
  return false
}
