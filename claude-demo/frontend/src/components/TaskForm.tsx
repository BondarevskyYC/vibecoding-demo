import { useForm } from 'react-hook-form'
import type { Task, TaskCreate, TaskUpdate, User } from '../types'
import Modal from './Modal'

interface CreateProps {
  mode: 'create'
  users: User[]
  onSubmit: (data: TaskCreate) => void
  onClose: () => void
  loading?: boolean
}

interface EditProps {
  mode: 'edit'
  initial: Task
  users: User[]
  currentUserId: string
  onSubmit: (data: TaskUpdate) => void
  onClose: () => void
  loading?: boolean
}

type Props = CreateProps | EditProps

interface FormValues {
  title: string
  description: string
  user_id: string
}

export default function TaskForm(props: Props) {
  const isEdit = props.mode === 'edit'
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: isEdit
      ? {
          title: (props as EditProps).initial.title,
          description: (props as EditProps).initial.description,
          user_id: (props as EditProps).currentUserId,
        }
      : { title: '', description: '', user_id: '' },
  })

  const onSubmit = (values: FormValues) => {
    if (isEdit) {
      ;(props as EditProps).onSubmit({
        title: values.title,
        description: values.description,
        updated_by: values.user_id,
      })
    } else {
      ;(props as CreateProps).onSubmit({
        title: values.title,
        description: values.description,
        created_by: values.user_id,
      })
    }
  }

  return (
    <Modal title={isEdit ? 'Редактировать задачу' : 'Новая задача'} onClose={props.onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Название</label>
          <input
            {...register('title', { required: 'Обязательное поле' })}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Название задачи"
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Описание</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Описание задачи"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            {isEdit ? 'Изменил' : 'Создал'}
          </label>
          <select
            {...register('user_id', { required: 'Выберите пользователя' })}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Выберите пользователя —</option>
            {props.users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          {errors.user_id && <p className="mt-1 text-xs text-red-500">{errors.user_id.message}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={props.onClose} className="rounded-lg border px-4 py-2 hover:bg-gray-50">
            Отмена
          </button>
          <button
            type="submit"
            disabled={props.loading}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {props.loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
