import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2, User } from 'lucide-react'
import { useState } from 'react'
import { usersApi } from '../api/users'
import ConfirmDialog from '../components/ConfirmDialog'
import UserForm from '../components/UserForm'
import type { User as UserType, UserCreate } from '../types'

export default function UsersPage() {
  const qc = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<UserType | null>(null)
  const [deleting, setDeleting] = useState<UserType | null>(null)

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.list,
  })

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setFormOpen(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserCreate }) => usersApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setEditing(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); qc.invalidateQueries({ queryKey: ['tasks'] }); setDeleting(null) },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Пользователи</h1>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <Plus size={16} />
          Добавить
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Загрузка...</p>
      ) : users.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">
          <User size={40} className="mx-auto mb-3 opacity-40" />
          <p>Нет пользователей</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.id.slice(0, 8)}…</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditing(user)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleting(user)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <UserForm
          onSubmit={(data) => createMutation.mutate(data)}
          onClose={() => setFormOpen(false)}
          loading={createMutation.isPending}
        />
      )}

      {editing && (
        <UserForm
          initial={editing}
          onSubmit={(data) => updateMutation.mutate({ id: editing.id, data })}
          onClose={() => setEditing(null)}
          loading={updateMutation.isPending}
        />
      )}

      {deleting && (
        <ConfirmDialog
          message={`Удалить пользователя «${deleting.name}»?`}
          onConfirm={() => deleteMutation.mutate(deleting.id)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
