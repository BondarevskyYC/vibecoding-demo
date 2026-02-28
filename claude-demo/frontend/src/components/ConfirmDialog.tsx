import Modal from './Modal'

interface Props {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return (
    <Modal title="Подтверждение" onClose={onCancel}>
      <p className="mb-6 text-gray-600">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="rounded-lg border px-4 py-2 hover:bg-gray-50">
          Отмена
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Удалить
        </button>
      </div>
    </Modal>
  )
}
