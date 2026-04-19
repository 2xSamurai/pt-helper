import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { BloatingEntry } from './types'

interface BloatingStore {
  entries: BloatingEntry[]
  add: (data: Omit<BloatingEntry, 'id' | 'createdAt' | 'updatedAt'>) => void
  update: (id: string, data: Partial<BloatingEntry>) => void
  remove: (id: string) => void
  restore: (entry: BloatingEntry) => void
}

export const useBloatingStore = create<BloatingStore>()(
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
      restore: (entry) =>
        set((s) => ({
          entries: s.entries.some((e) => e.id === entry.id)
            ? s.entries
            : [entry, ...s.entries],
        })),
    }),
    { name: 'pt-bloating' }
  )
)
