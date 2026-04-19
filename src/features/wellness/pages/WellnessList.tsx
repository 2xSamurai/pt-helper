import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Brain } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { ViewToggle, type ViewMode } from '@/components/ViewToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useWellnessStore } from '@/store/wellness'
import { WellnessForm } from '../WellnessForm'
import { WellnessCharts } from '../WellnessCharts'
import { formatDateTime } from '@/lib/utils'

const MIND_EMOJI = ['', '🌫️', '😔', '😐', '😊', '🌟']
const ENERGY_EMOJI = ['', '😴', '🔋', '⚡', '🚀', '💥']

export function WellnessList() {
  const { entries, add, remove } = useWellnessStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<ViewMode>('list')

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Wellness"
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
          <EmptyState Icon={Brain} title="No entries yet" description="Tap + to log your first wellness check-in." />
        ) : view === 'list' ? (
          <div className="flex flex-col gap-3">
            {entries.map((e) => (
              <Card key={e.id} className="cursor-pointer active:opacity-70" onClick={() => navigate(`/trackers/wellness/${e.id}`)}>
                <CardContent className="pt-4 flex items-start gap-3">
                  <div className="text-2xl leading-none mt-1">{MIND_EMOJI[e.mindClarity]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-3 text-sm text-[var(--text)]">
                      <span>Mind: <strong>{e.mindClarity}/5</strong></span>
                      <span>Energy: <strong>{e.energy}/5</strong> {ENERGY_EMOJI[e.energy]}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatDateTime(e.createdAt)}</p>
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
          <WellnessCharts entries={entries} view={view} />
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Log Wellness</DialogTitle></DialogHeader>
          <WellnessForm onSubmit={(data) => { add(data); setOpen(false) }} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
