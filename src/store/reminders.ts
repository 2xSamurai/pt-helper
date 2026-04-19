import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { Task } from './types'

interface RemindersStore {
  tasks: Task[]
  add: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => string
  update: (id: string, data: Partial<Task>) => void
  remove: (id: string) => void
  setParent: (id: string, parentId: string | null) => void
}

export const useRemindersStore = create<RemindersStore>()(
  persist(
    (set) => ({
      tasks: [],
      add: (data) => {
        const id = uuid()
        set((s) => ({
          tasks: [
            ...s.tasks,
            { ...data, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ],
        }))
        return id
      },
      update: (id, data) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
          ),
        })),
      remove: (id) =>
        set((s) => ({
          tasks: s.tasks.filter((t) => t.id !== id && t.parentId !== id),
        })),
      setParent: (id, parentId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, parentId, updatedAt: new Date().toISOString() } : t
          ),
        })),
    }),
    { name: 'pt-reminders' }
  )
)
