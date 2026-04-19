export interface BaseEntry {
  id: string
  createdAt: string
  updatedAt: string
  note: string
}

// ─── Bloating ───
export interface BloatingEntry extends BaseEntry {
  level: 0 | 1 | 2 | 3 | 4 | 5
}

export const BLOATING_LABELS: Record<number, string> = {
  0: 'No bloating',
  1: 'Slight fullness',
  2: 'Noticeable, comfortable',
  3: 'Belly tight / uncomfortable',
  4: 'Very bloated',
  5: 'Painful bloating',
}

// ─── Bowel ───
export interface BowelEntry extends BaseEntry {
  stoolType: string
  emptiness: string
}

export const DEFAULT_STOOL_TYPES = ['Hard / difficult', 'Normal', 'Soft', 'Loose']
export const DEFAULT_EMPTINESS_OPTIONS = ['Complete', 'Incomplete', 'Not completely empty']

// ─── Wellness ───
export interface WellnessEntry extends BaseEntry {
  mindClarity: 1 | 2 | 3 | 4 | 5
  energy: 1 | 2 | 3 | 4 | 5
}

// ─── Eating ───
export interface FoodItem {
  name: string
  grams: number | null
}

export interface EatingEntry extends BaseEntry {
  mealTime: string
  foods: FoodItem[]
}

export const DEFAULT_MEAL_TIMES = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

// ─── Reminders / Tasks ───
export type RepeatType = 'never' | 'daily' | 'weekdays' | 'weekends' | 'custom'
export type CustomFrequency = 'daily' | 'weekly' | 'every-x-days'

export interface TaskRepeat {
  type: RepeatType
  startDate?: string
  endDate?: string
  customFrequency?: CustomFrequency
  customEveryXDays?: number
}

export interface CompletionRecord {
  date: string       // yyyy-MM-dd
  completed: boolean
}

export interface Task {
  id: string
  parentId: string | null
  title: string
  description: string
  repeat: TaskRepeat
  reminderTime: string | null  // "HH:MM" format (24h)
  completed: boolean
  completionHistory: CompletionRecord[]
  lastResetDate: string | null  // yyyy-MM-dd of last auto-reset
  createdAt: string
  updatedAt: string
}

// ─── App settings ───
export interface AppSettings {
  darkMode: boolean
  accentHue: number
  hiddenSections: string[]
  customStoolTypes: string[]
  customEmptinessOptions: string[]
  customMealTimes: string[]
}
