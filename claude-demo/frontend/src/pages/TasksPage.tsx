import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { tasksApi } from '../api/tasks'
import { usersApi } from '../api/users'
import ConfirmDialog from '../components/ConfirmDialog'
import TaskForm from '../components/TaskForm'
import type { Task, TaskCreate, TaskUpdate } from '../types'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function TasksPage() {
  const qc = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [deleting, setDeleting] = useState<Task | null>(null)

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.list,
  })

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.list,
  })

  const createMutation = useMutation({
    mutationFn: (data: TaskCreate) => tasksApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); setFormOpen(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskUpdate }) => tasksApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); setEditing(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); setDeleting(null) },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Задачи</h1>
        <button
          onClick={() => setFormOpen(true)}
          disabled={users.length === 0}
          title={users.length === 0 ? 'Сначала создайте пользователя' : undefined}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={16} />
          Создать задачу
        </button>
      </div>

      {tasksLoading ? (
        <p className="text-gray-500">Загрузка...</p>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">
          <CalendarDays size={40} className="mx-auto mb-3 opacity-40" />
          <p>Нет задач</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold">{task.title}</h3>
                  {task.description && (
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => setEditing(task)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleting(task)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t pt-3 text-xs text-gray-500">
                <span>
                  <span className="font-medium text-gray-700">Создал:</span>{' '}
                  {task.creator.name}
                </span>
                <span>
                  <span className="font-medium text-gray-700">Создано:</span>{' '}
                  {formatDate(task.created_at)}
                </span>
                {task.updater && (
                  <>
                    <span>
                      <span className="font-medium text-gray-700">Изменил:</span>{' '}
                      {task.updater.name}
                    </span>
                    <span>
                      <span className="font-medium text-gray-700">Изменено:</span>{' '}
                      {formatDate(task.updated_at)}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <TaskForm
          mode="create"
          users={users}
          onSubmit={(data) => createMutation.mutate(data)}
          onClose={() => setFormOpen(false)}
          loading={createMutation.isPending}
        />
      )}

      {editing && (
        <TaskForm
          mode="edit"
          initial={editing}
          users={users}
          currentUserId={editing.updated_by ?? editing.created_by}
          onSubmit={(data) => updateMutation.mutate({ id: editing.id, data })}
          onClose={() => setEditing(null)}
          loading={updateMutation.isPending}
        />
      )}

      {deleting && (
        <ConfirmDialog
          message={`Удалить задачу «${deleting.title}»?`}
          onConfirm={() => deleteMutation.mutate(deleting.id)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
