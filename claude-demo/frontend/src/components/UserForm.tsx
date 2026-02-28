import { useForm } from 'react-hook-form'
import type { User, UserCreate } from '../types'
import Modal from './Modal'

interface Props {
  initial?: User
  onSubmit: (data: UserCreate) => void
  onClose: () => void
  loading?: boolean
}

export default function UserForm({ initial, onSubmit, onClose, loading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<UserCreate>({
    defaultValues: { name: initial?.name ?? '' },
  })

  return (
    <Modal title={initial ? 'Редактировать пользователя' : 'Новый пользователь'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Имя</label>
          <input
            {...register('name', { required: 'Обязательное поле' })}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Имя пользователя"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 hover:bg-gray-50">
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
