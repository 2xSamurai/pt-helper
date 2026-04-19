import { useState } from 'react'
import { Plus, Bell } from 'lucide-react'
import {
  DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRemindersStore } from '@/store/reminders'
import { TaskCard } from '../TaskCard'
import { TaskForm } from '../TaskForm'
import type { Task } from '@/store/types'
import { useTaskRepeat } from '@/hooks/useTaskRepeat'

function isDescendant(tasks: Task[], childId: string, ancestorId: string): boolean {
  const child = tasks.find((t) => t.id === childId)
  if (!child || !child.parentId) return false
  if (child.parentId === ancestorId) return true
  return isDescendant(tasks, child.parentId, ancestorId)
}

export function RemindersList() {
  useTaskRepeat()

  const { tasks, add, setParent } = useRemindersStore()
  const [open, setOpen] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const rootTasks = tasks.filter((t) => t.parentId === null)
  const subTasksOf = (parentId: string) => tasks.filter((t) => t.parentId === parentId)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 12 } }))

  function handleDragEnd(event: DragEndEvent) {
    setDraggingId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    const activeId = String(active.id)
    const overId = String(over.id)
    if (isDescendant(tasks, overId, activeId)) return  // prevent circular nesting
    setParent(activeId, overId)
  }

  const draggingTask = draggingId ? tasks.find((t) => t.id === draggingId) : null

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Reminders"
        action={<Button size="icon" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /></Button>}
      />

      <div className="flex-1 p-4 mb-nav md:mb-0">
        {tasks.length === 0 ? (
          <EmptyState Icon={Bell} title="No reminders yet" description="Tap + to create your first task." />
        ) : (
          <>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              Drag a task <strong>onto</strong> another to nest it as a subtask.
            </p>
            <DndContext
              sensors={sensors}
              onDragStart={(e) => setDraggingId(String(e.active.id))}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setDraggingId(null)}
            >
              <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                  {rootTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      subtasks={subTasksOf(task.id)}
                      allTasks={tasks}
                    />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {draggingTask && (
                  <div className="rounded-xl border border-[var(--primary)] bg-[var(--bg-card)] px-4 py-3 shadow-lg opacity-90 text-sm font-medium text-[var(--text)]">
                    {draggingTask.title}
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          </>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
          <TaskForm
            onSubmit={(data) => { add(data); setOpen(false) }}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
