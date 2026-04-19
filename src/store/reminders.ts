import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { Task, CompletionRecord } from './types'

interface RemindersStore {
  tasks: Task[]
  add: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => string
  update: (id: string, data: Partial<Task>) => void
  remove: (id: string) => void
  setParent: (id: string, parentId: string | null) => void
  logAndReset: (id: string, record: CompletionRecord) => void
}

const DEFAULT_TASK_FIELDS = {
  completionHistory: [] as CompletionRecord[],
  lastResetDate: null as string | null,
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
            {
              ...DEFAULT_TASK_FIELDS,
              ...data,
              id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
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
      logAndReset: (id, record) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: false,
                  completionHistory: [...(t.completionHistory ?? []), record],
                  lastResetDate: record.date,
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        })),
    }),
    {
      name: 'pt-reminders',
      // Backfill missing fields for tasks created before this schema update
      onRehydrateStorage: () => (state) => {
        if (!state) return
        state.tasks = state.tasks.map((t) => ({
          ...DEFAULT_TASK_FIELDS,
          ...t,
        }))
      },
    }
  )
)
