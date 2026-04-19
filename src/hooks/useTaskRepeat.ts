import { useEffect } from 'react'
import { useRemindersStore } from '@/store/reminders'
import { isRepeatDay, todayStr } from '@/lib/repeat'

export function useTaskRepeat() {
  useEffect(() => {
    const { tasks, logAndReset } = useRemindersStore.getState()
    const today = todayStr()

    tasks.forEach((task) => {
      if (task.repeat.type === 'never') return
      if (task.lastResetDate === today) return
      if (!isRepeatDay(task.repeat)) return

      logAndReset(task.id, {
        date: task.lastResetDate ?? today,
        completed: task.completed,
      })
    })
  }, [])
}
