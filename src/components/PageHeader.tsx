import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  back?: boolean
  action?: ReactNode
  className?: string
}

export function PageHeader({ title, back, action, className }: PageHeaderProps) {
  const navigate = useNavigate()
  return (
    <header className={cn(
      'sticky top-0 z-30 flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]',
      className
    )}>
      {back && (
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      <h1 className="flex-1 text-base font-semibold text-[var(--text)]">{title}</h1>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </header>
  )
}
