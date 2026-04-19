import { create } from 'zustand'

interface UndoStore {
  message: string | null
  undoFn: (() => void) | null
  show: (message: string, undoFn: () => void, timeoutMs?: number) => void
  dismiss: () => void
  executeUndo: () => void
}

// Module-level so we can clear across renders without useRef
let _tid: ReturnType<typeof setTimeout> | null = null

export const useUndoStore = create<UndoStore>()((set, get) => ({
  message: null,
  undoFn: null,

  show: (message, undoFn, timeoutMs = 5000) => {
    if (_tid) clearTimeout(_tid)
    set({ message, undoFn })
    _tid = setTimeout(() => {
      set({ message: null, undoFn: null })
      _tid = null
    }, timeoutMs)
  },

  dismiss: () => {
    if (_tid) { clearTimeout(_tid); _tid = null }
    set({ message: null, undoFn: null })
  },

  executeUndo: () => {
    get().undoFn?.()
    get().dismiss()
  },
}))
