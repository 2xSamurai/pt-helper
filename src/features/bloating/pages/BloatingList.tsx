import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Activity } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { ViewToggle, type ViewMode } from '@/components/ViewToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { useBloatingStore } from '@/store/bloating'
import { BLOATING_LABELS } from '@/store/types'
import { BloatingForm } from '../BloatingForm'
import { BloatingCharts } from '../BloatingCharts'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

const LEVEL_COLORS = [
  'bg-green-500', 'bg-lime-500', 'bg-yellow-500',
  'bg-orange-500', 'bg-red-500', 'bg-red-700',
]

export function BloatingList() {
  const { entries, add, remove } = useBloatingStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<ViewMode>('list')

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Bloating"
        back
        action={
          <div className="flex items-center gap-2">
            <ViewToggle current={view} onChange={setView} />
            <Button size="icon" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-4 mb-nav">
        {entries.length === 0 ? (
          <EmptyState Icon={Activity} title="No entries yet" description="Tap + to log your first bloating entry." />
        ) : view === 'list' ? (
          <div className="flex flex-col gap-3">
            {entries.map((e) => (
              <Card
                key={e.id}
                className="cursor-pointer active:opacity-70 transition-opacity"
                onClick={() => navigate(`/trackers/bloating/${e.id}`)}
              >
                <CardContent className="pt-4 flex items-start gap-3">
                  <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white', LEVEL_COLORS[e.level])}>
                    {e.level}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--text)] text-sm">{BLOATING_LABELS[e.level]}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatDateTime(e.createdAt)}</p>
                    {e.note && <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{e.note}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-[var(--text-muted)] hover:text-[var(--destructive)]"
                    onClick={(ev) => { ev.stopPropagation(); remove(e.id) }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <BloatingCharts entries={entries} view={view} />
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Bloating</DialogTitle>
          </DialogHeader>
          <BloatingForm
            onSubmit={(data) => { add(data); setOpen(false) }}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
