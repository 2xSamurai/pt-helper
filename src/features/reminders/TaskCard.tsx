import { useState } from 'react'
import { ChevronRight, ChevronDown, Trash2, Pencil, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRemindersStore } from '@/store/reminders'
import { TaskForm } from './TaskForm'
import type { Task } from '@/store/types'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TaskCardProps {
  task: Task
  depth?: number
  children?: Task[]
}

function RepeatBadge({ repeat }: { repeat: Task['repeat'] }) {
  if (repeat.type === 'never') return null
  const label = repeat.type === 'custom'
    ? repeat.customFrequency === 'every-x-days'
      ? `Every ${repeat.customEveryXDays}d`
      : repeat.customFrequency
    : repeat.type
  return <Badge variant="secondary" className="text-[10px] capitalize">{label}</Badge>
}

export function TaskCard({ task, depth = 0, children = [] }: TaskCardProps) {
  const { update, remove, add } = useRemindersStore()
  const [expanded, setExpanded] = useState(true)
  const [editing, setEditing] = useState(false)
  const [addingSub, setAddingSub] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className={cn('transition-opacity', depth > 0 && 'border-l-2 border-l-[var(--primary)] rounded-l-none ml-4')}>
        <CardContent className="pt-3 pb-3">
          <div className="flex items-start gap-2">
            <button
              {...listeners}
              className="mt-0.5 cursor-grab touch-none text-[var(--text-muted)]"
              title="Drag to reorder"
            >
              ⠿
            </button>

            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => update(task.id, { completed: !task.completed })}
              className="mt-1 h-4 w-4 accent-[var(--primary)] shrink-0 cursor-pointer"
            />

            <div className="flex-1 min-w-0">
              <p className={cn('text-sm font-medium text-[var(--text)]', task.completed && 'line-through text-[var(--text-muted)]')}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{task.description}</p>
              )}
              <div className="flex flex-wrap gap-1 mt-1">
                <RepeatBadge repeat={task.repeat} />
                {task.reminderTime && (
                  <Badge variant="outline" className="text-[10px]">⏰ {formatDateTime(task.reminderTime)}</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-0.5 shrink-0">
              {children.length > 0 && (
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(!expanded)}>
                  {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setAddingSub(true)}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(true)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost" size="icon"
                className="h-7 w-7 text-[var(--text-muted)] hover:text-[var(--destructive)]"
                onClick={() => remove(task.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {expanded && children.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {children.map((sub) => (
            <TaskCard key={sub.id} task={sub} depth={depth + 1} />
          ))}
        </div>
      )}

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
          <TaskForm
            initial={task}
            onSubmit={(data) => { update(task.id, data); setEditing(false) }}
            onCancel={() => setEditing(false)}
            submitLabel="Update"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={addingSub} onOpenChange={setAddingSub}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Sub-task</DialogTitle></DialogHeader>
          <TaskForm
            parentId={task.id}
            onSubmit={(data) => { add(data); setAddingSub(false) }}
            onCancel={() => setAddingSub(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
