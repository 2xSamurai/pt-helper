import { useEffect, useRef } from 'react'
import { useRemindersStore } from '@/store/reminders'
import { isRepeatDay } from '@/lib/repeat'
import { format } from 'date-fns'

const SENT_KEY = 'pt-notifications-sent'

function getSentMap(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(SENT_KEY) ?? '{}') } catch { return {} }
}

function markSent(taskId: string) {
  const map = getSentMap()
  map[taskId] = format(new Date(), 'yyyy-MM-dd HH:mm')
  localStorage.setItem(SENT_KEY, JSON.stringify(map))
}

function alreadySentThisMinute(taskId: string, currentMinute: string): boolean {
  return getSentMap()[taskId] === currentMinute
}

function shouldNotifyToday(task: { repeat: Parameters<typeof isRepeatDay>[0]; reminderTime: string | null }): boolean {
  if (!task.reminderTime) return false
  if (task.repeat.type === 'never') return true  // one-shot: always eligible
  return isRepeatDay(task.repeat)
}

export function useReminderNotifications() {
  const permissionRequested = useRef(false)

  useEffect(() => {
    if (!('Notification' in window)) return
    if (!permissionRequested.current) {
      permissionRequested.current = true
      Notification.requestPermission()
    }

    function checkNow() {
      if (Notification.permission !== 'granted') return
      const { tasks } = useRemindersStore.getState()
      const nowHHMM = format(new Date(), 'HH:mm')
      const currentMinute = format(new Date(), 'yyyy-MM-dd HH:mm')

      tasks.forEach((task) => {
        if (!task.reminderTime) return
        if (task.reminderTime !== nowHHMM) return
        if (!shouldNotifyToday(task)) return
        if (alreadySentThisMinute(task.id, currentMinute)) return

        markSent(task.id)
        new Notification(`PT Helper — ${task.title}`, {
          body: task.description || 'Time to log this task!',
          icon: '/pt-helper/pwa-192x192.png',
          tag: task.id,
        })
      })
    }

    checkNow()
    const interval = setInterval(checkNow, 60_000)
    return () => clearInterval(interval)
  }, [])
}
