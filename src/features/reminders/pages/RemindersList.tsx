import { useState } from 'react'
import { Plus, Bell } from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRemindersStore } from '@/store/reminders'
import { TaskCard } from '../TaskCard'
import { TaskForm } from '../TaskForm'

export function RemindersList() {
  const { tasks, add, setParent } = useRemindersStore()
  const [open, setOpen] = useState(false)

  const rootTasks = tasks.filter((t) => t.parentId === null)
  const subTasksOf = (parentId: string) => tasks.filter((t) => t.parentId === parentId)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const activeTask = tasks.find((t) => t.id === active.id)
    const overTask = tasks.find((t) => t.id === over.id)
    if (!activeTask || !overTask) return
    if (activeTask.parentId === null && overTask.parentId === null) return
    setParent(String(active.id), String(over.id))
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Reminders"
        action={
          <Button size="icon" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /></Button>
        }
      />

      <div className="flex-1 p-4 mb-nav">
        {rootTasks.length === 0 ? (
          <EmptyState Icon={Bell} title="No reminders yet" description="Tap + to create your first task." />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={rootTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-3">
                {rootTasks.map((task) => (
                  <TaskCard key={task.id} task={task} children={subTasksOf(task.id)} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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
