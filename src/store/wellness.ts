import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { WellnessEntry } from './types'

interface WellnessStore {
  entries: WellnessEntry[]
  add: (data: Omit<WellnessEntry, 'id' | 'createdAt' | 'updatedAt'>) => void
  update: (id: string, data: Partial<WellnessEntry>) => void
  remove: (id: string) => void
}

export const useWellnessStore = create<WellnessStore>()(
  persist(
    (set) => ({
      entries: [],
      add: (data) =>
        set((s) => ({
          entries: [
            { ...data, id: uuid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            ...s.entries,
          ],
        })),
      update: (id, data) =>
        set((s) => ({
          entries: s.entries.map((e) =>
            e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
          ),
        })),
      remove: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
    }),
    { name: 'pt-wellness' }
  )
)
