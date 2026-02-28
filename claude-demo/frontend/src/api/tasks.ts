import type { Task, TaskCreate, TaskUpdate } from '../types'
import client from './client'

export const tasksApi = {
  list: () => client.get<Task[]>('/tasks/').then((r) => r.data),
  get: (id: string) => client.get<Task>(`/tasks/${id}`).then((r) => r.data),
  create: (data: TaskCreate) => client.post<Task>('/tasks/', data).then((r) => r.data),
  update: (id: string, data: TaskUpdate) =>
    client.put<Task>(`/tasks/${id}`, data).then((r) => r.data),
  delete: (id: string) => client.delete(`/tasks/${id}`),
}
