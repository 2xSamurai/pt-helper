import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { EatingEntry } from './types'

interface EatingStore {
  entries: EatingEntry[]
  add: (data: Omit<EatingEntry, 'id' | 'createdAt' | 'updatedAt'>) => void
  update: (id: string, data: Partial<EatingEntry>) => void
  remove: (id: string) => void
}

export const useEatingStore = create<EatingStore>()(
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
    {
      name: 'pt-eating',
      onRehydrateStorage: () => (state) => {
        if (!state) return
        // Migrate v0 entries (foodName/portionGrams) → v1 (foods array)
        state.entries = state.entries.map((e: EatingEntry & { foodName?: string; portionGrams?: number | null }) => {
          if (!e.foods) {
            return {
              ...e,
              foods: e.foodName ? [{ name: e.foodName, grams: e.portionGrams ?? null }] : [],
            }
          }
          return e
        })
      },
    }
  )
)
