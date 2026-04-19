import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, UtensilsCrossed } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { ViewToggle, type ViewMode } from '@/components/ViewToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEatingStore } from '@/store/eating'
import { EatingForm } from '../EatingForm'
import { EatingCharts } from '../EatingCharts'
import { formatDateTime } from '@/lib/utils'

export function EatingList() {
  const { entries, add, remove } = useEatingStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<ViewMode>('list')

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Eating"
        back
        action={
          <div className="flex items-center gap-2">
            <ViewToggle current={view} onChange={setView} />
            <Button size="icon" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /></Button>
          </div>
        }
      />
      <div className="flex-1 p-4 mb-nav">
        {entries.length === 0 ? (
          <EmptyState Icon={UtensilsCrossed} title="No entries yet" description="Tap + to log your first meal." />
        ) : view === 'list' ? (
          <div className="flex flex-col gap-3">
            {entries.map((e) => (
              <Card key={e.id} className="cursor-pointer active:opacity-70" onClick={() => navigate(`/trackers/eating/${e.id}`)}>
                <CardContent className="pt-4 flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--eating-color)] flex items-center justify-center">
                    <UtensilsCrossed className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1 mb-1">
                      <Badge variant="secondary">{e.mealTime}</Badge>
                      {e.portionGrams != null && <Badge variant="outline">{e.portionGrams}g</Badge>}
                    </div>
                    <p className="text-sm font-medium text-[var(--text)] truncate">{e.foodName}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatDateTime(e.createdAt)}</p>
                    {e.note && <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{e.note}</p>}
                  </div>
                  <Button
                    variant="ghost" size="icon"
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
          <EatingCharts entries={entries} view={view} />
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Log Meal</DialogTitle></DialogHeader>
          <EatingForm onSubmit={(data) => { add(data); setOpen(false) }} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
