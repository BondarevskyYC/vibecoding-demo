import { useState } from 'react'
import { CheckSquare, Users } from 'lucide-react'
import TasksPage from './pages/TasksPage'
import UsersPage from './pages/UsersPage'

type Tab = 'tasks' | 'users'

export default function App() {
  const [tab, setTab] = useState<Tab>('tasks')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
          <h1 className="text-xl font-bold text-blue-600">Task Tracker</h1>
          <nav className="flex gap-1">
            <button
              onClick={() => setTab('tasks')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === 'tasks'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CheckSquare size={16} />
              Задачи
            </button>
            <button
              onClick={() => setTab('users')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === 'users'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users size={16} />
              Пользователи
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {tab === 'tasks' ? <TasksPage /> : <UsersPage />}
      </main>
    </div>
  )
}
