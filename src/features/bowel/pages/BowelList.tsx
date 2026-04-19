import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Droplets } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { ViewToggle, type ViewMode } from '@/components/ViewToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useBowelStore } from '@/store/bowel'
import { useUndoStore } from '@/store/undo'
import { BowelForm } from '../BowelForm'
import { BowelCharts } from '../BowelCharts'
import { formatDateTime } from '@/lib/utils'

export function BowelList() {
  const { entries, add, remove, restore } = useBowelStore()
  const showUndo = useUndoStore((s) => s.show)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<ViewMode>('list')

  function handleDelete(id: string) {
    const entry = entries.find((e) => e.id === id)
    if (!entry) return
    remove(id)
    showUndo('Bowel entry deleted', () => restore(entry))
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Bowel Movement"
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
          <EmptyState Icon={Droplets} title="No entries yet" description="Tap + to log your first bowel movement." />
        ) : view === 'list' ? (
          <div className="flex flex-col gap-3">
            {entries.map((e) => (
              <Card key={e.id} className="cursor-pointer active:opacity-70" onClick={() => navigate(`/trackers/bowel/${e.id}`)}>
                <CardContent className="pt-4 flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--bowel-color)] flex items-center justify-center">
                    <Droplets className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1 mb-1">
                      <Badge variant="secondary">{e.stoolType}</Badge>
                      <Badge variant="outline">{e.emptiness}</Badge>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">{formatDateTime(e.createdAt)}</p>
                    {e.note && <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{e.note}</p>}
                  </div>
                  <Button
                    variant="ghost" size="icon"
                    className="shrink-0 text-[var(--text-muted)] hover:text-[var(--destructive)]"
                    onClick={(ev) => { ev.stopPropagation(); handleDelete(e.id) }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <BowelCharts entries={entries} view={view} />
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Log Bowel Movement</DialogTitle></DialogHeader>
          <BowelForm
            onSubmit={(data) => { add(data); setOpen(false) }}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
