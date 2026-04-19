import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        {
          'bg-[var(--primary)] text-[var(--primary-fg)]': variant === 'default',
          'bg-[var(--bg-subtle)] text-[var(--text-muted)]': variant === 'secondary',
          'border border-[var(--border)] text-[var(--text)]': variant === 'outline',
          'bg-[var(--destructive)] text-[var(--destructive-fg)]': variant === 'destructive',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
