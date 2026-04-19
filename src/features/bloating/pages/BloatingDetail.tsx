import { useParams, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { useBloatingStore } from '@/store/bloating'
import { useUndoStore } from '@/store/undo'
import { BloatingForm } from '../BloatingForm'
import type { BloatingEntry } from '@/store/types'

export function BloatingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { entries, update, remove, restore } = useBloatingStore()
  const showUndo = useUndoStore((s) => s.show)
  const entry = entries.find((e) => e.id === id)

  if (!entry) return <div className="p-4 text-[var(--text-muted)]">Entry not found.</div>

  function handleSave(data: { level: BloatingEntry['level']; note: string }) {
    update(entry!.id, data)
    navigate(-1)
  }

  function handleDelete() {
    remove(entry!.id)
    showUndo('Bloating entry deleted', () => restore(entry!))
    navigate(-1)
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Edit Entry"
        back
        action={
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-[var(--destructive)]" />
          </Button>
        }
      />
      <div className="p-4 mb-nav">
        <BloatingForm
          initial={entry}
          onSubmit={handleSave}
          onCancel={() => navigate(-1)}
          submitLabel="Update"
        />
      </div>
    </div>
  )
}
