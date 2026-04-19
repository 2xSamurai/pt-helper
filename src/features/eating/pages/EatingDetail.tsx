import { useParams, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { useEatingStore } from '@/store/eating'
import { EatingForm } from '../EatingForm'

export function EatingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { entries, update, remove } = useEatingStore()
  const entry = entries.find((e) => e.id === id)
  if (!entry) return <div className="p-4 text-[var(--text-muted)]">Entry not found.</div>

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Edit Entry" back
        action={<Button variant="ghost" size="icon" onClick={() => { remove(entry.id); navigate(-1) }}><Trash2 className="h-4 w-4 text-[var(--destructive)]" /></Button>}
      />
      <div className="p-4 mb-nav">
        <EatingForm
          initial={entry}
          onSubmit={(data) => { update(entry.id, data); navigate(-1) }}
          onCancel={() => navigate(-1)}
          submitLabel="Update"
        />
      </div>
    </div>
  )
}
