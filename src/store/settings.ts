import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings } from './types'
import { DEFAULT_STOOL_TYPES, DEFAULT_EMPTINESS_OPTIONS, DEFAULT_MEAL_TIMES } from './types'

interface SettingsStore extends AppSettings {
  set: (patch: Partial<AppSettings>) => void
  toggleSection: (section: string) => void
  addCustomStoolType: (val: string) => void
  removeCustomStoolType: (val: string) => void
  addCustomEmptiness: (val: string) => void
  removeCustomEmptiness: (val: string) => void
  addCustomMealTime: (val: string) => void
  removeCustomMealTime: (val: string) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      darkMode: false,
      accentHue: 293,
      hiddenSections: [],
      customStoolTypes: DEFAULT_STOOL_TYPES,
      customEmptinessOptions: DEFAULT_EMPTINESS_OPTIONS,
      customMealTimes: DEFAULT_MEAL_TIMES,
      set: (patch) => set((s) => ({ ...s, ...patch })),
      toggleSection: (section) =>
        set((s) => ({
          hiddenSections: s.hiddenSections.includes(section)
            ? s.hiddenSections.filter((x) => x !== section)
            : [...s.hiddenSections, section],
        })),
      addCustomStoolType: (val) =>
        set((s) => ({ customStoolTypes: [...s.customStoolTypes, val] })),
      removeCustomStoolType: (val) =>
        set((s) => ({ customStoolTypes: s.customStoolTypes.filter((x) => x !== val) })),
      addCustomEmptiness: (val) =>
        set((s) => ({ customEmptinessOptions: [...s.customEmptinessOptions, val] })),
      removeCustomEmptiness: (val) =>
        set((s) => ({ customEmptinessOptions: s.customEmptinessOptions.filter((x) => x !== val) })),
      addCustomMealTime: (val) =>
        set((s) => ({ customMealTimes: [...s.customMealTimes, val] })),
      removeCustomMealTime: (val) =>
        set((s) => ({ customMealTimes: s.customMealTimes.filter((x) => x !== val) })),
    }),
    { name: 'pt-settings' }
  )
)
