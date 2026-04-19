import { useEffect, useState } from 'react'
import { X, Undo2 } from 'lucide-react'
import { useUndoStore } from '@/store/undo'
import { cn } from '@/lib/utils'

const TIMEOUT_MS = 5000

export function UndoToast() {
  const { message, executeUndo, dismiss } = useUndoStore()
  const [progress, setProgress] = useState(100)

  // Animate the shrinking progress bar each time a new message appears
  useEffect(() => {
    if (!message) { setProgress(100); return }
    setProgress(100)
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / TIMEOUT_MS) * 100)
      setProgress(remaining)
      if (remaining === 0) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [message])

  if (!message) return null

  return (
    <div
      className={cn(
        'fixed z-50 left-1/2 -translate-x-1/2',
        // Mobile: above bottom nav; Desktop: bottom-right corner
        'bottom-20 md:bottom-6 md:left-auto md:right-6 md:translate-x-0',
        'min-w-[280px] max-w-[90vw]',
        'rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-lg',
        'overflow-hidden',
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Progress bar */}
      <div
        className="h-0.5 bg-[var(--primary)] transition-none"
        style={{ width: `${progress}%` }}
      />

      <div className="flex items-center gap-3 px-4 py-3">
        <p className="flex-1 text-sm text-[var(--text)]">{message}</p>

        <button
          onClick={executeUndo}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] shrink-0 transition-colors"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Undo
        </button>

        <button
          onClick={dismiss}
          className="text-[var(--text-muted)] hover:text-[var(--text)] shrink-0 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
