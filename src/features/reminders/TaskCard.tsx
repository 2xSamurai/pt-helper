import { useState } from 'react'
import { ChevronRight, ChevronDown, Trash2, Pencil, Plus, Unlink, Copy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRemindersStore } from '@/store/reminders'
import { useUndoStore } from '@/store/undo'
import { TaskForm } from './TaskForm'
import type { Task } from '@/store/types'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TaskCardProps {
  task: Task
  subtasks?: Task[]
  allTasks?: Task[]
  depth?: number
}

function RepeatBadge({ repeat }: { repeat: Task['repeat'] }) {
  if (repeat.type === 'never') return null
  const label = repeat.type === 'custom'
    ? repeat.customFrequency === 'every-x-days'
      ? `Every ${repeat.customEveryXDays}d`
      : repeat.customFrequency ?? 'custom'
    : repeat.type
  return <Badge variant="secondary" className="text-[10px] capitalize">{label}</Badge>
}

function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

export function TaskCard({ task, subtasks = [], allTasks = [], depth = 0 }: TaskCardProps) {
  const { update, remove, restore, add, setParent } = useRemindersStore()
  const showUndo = useUndoStore((s) => s.show)
  const [expanded, setExpanded] = useState(true)
  const [editing, setEditing] = useState(false)
  const [addingSub, setAddingSub] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  const subTasksOfThis = allTasks.filter((t) => t.parentId === task.id)

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={cn(isDragging && 'opacity-40')}>
      <Card className={cn(
        'transition-colors',
        depth > 0 && 'border-l-2 border-l-[var(--primary)] rounded-tl-none rounded-bl-none ml-5'
      )}>
        <CardContent className="pt-3 pb-3">
          <div className="flex items-start gap-2">
            {/* Drag handle */}
            <button
              {...listeners}
              className="mt-1 cursor-grab touch-none text-[var(--text-muted)] text-base leading-none select-none"
              title="Drag onto another task to nest as subtask"
            >
              ⠿
            </button>

            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
                const next = !task.completed
                update(task.id, { completed: next })
                if (next) {
                  allTasks.filter((t) => t.parentId === task.id).forEach((t) => update(t.id, { completed: true }))
                }
              }}
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
                  <Badge variant="outline" className="text-[10px]">⏰ {formatTime(task.reminderTime)}</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-0.5 shrink-0">
              {(subtasks.length > 0 || subTasksOfThis.length > 0) && (
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(!expanded)}>
                  {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </Button>
              )}
              {depth > 0 && (
                <Button
                  variant="ghost" size="icon"
                  className="h-7 w-7 text-[var(--text-muted)]"
                  title="Detach from parent"
                  onClick={() => setParent(task.id, null)}
                >
                  <Unlink className="h-3.5 w-3.5" />
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
                className="h-7 w-7 text-[var(--text-muted)]"
                title="Duplicate task"
                onClick={() => {
                  add({
                    parentId: task.parentId,
                    title: `${task.title} (copy)`,
                    description: task.description,
                    repeat: task.repeat,
                    reminderTime: task.reminderTime,
                    completed: false,
                    completionHistory: [],
                    lastResetDate: null,
                  })
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost" size="icon"
                className="h-7 w-7 text-[var(--text-muted)] hover:text-[var(--destructive)]"
                onClick={() => {
                  // Capture task + its direct subtasks before remove (which cascades)
                  const { tasks } = useRemindersStore.getState()
                  const children = tasks.filter((t) => t.parentId === task.id)
                  remove(task.id)
                  showUndo(`"${task.title}" deleted`, () => {
                    restore(task)
                    children.forEach((c) => restore(c))
                  })
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {expanded && subTasksOfThis.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {subTasksOfThis.map((sub) => (
            <TaskCard key={sub.id} task={sub} allTasks={allTasks} depth={depth + 1} />
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
