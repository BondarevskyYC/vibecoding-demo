import type { User, UserCreate, UserUpdate } from '../types'
import client from './client'

export const usersApi = {
  list: () => client.get<User[]>('/users/').then((r) => r.data),
  get: (id: string) => client.get<User>(`/users/${id}`).then((r) => r.data),
  create: (data: UserCreate) => client.post<User>('/users/', data).then((r) => r.data),
  update: (id: string, data: UserUpdate) =>
    client.put<User>(`/users/${id}`, data).then((r) => r.data),
  delete: (id: string) => client.delete(`/users/${id}`),
}
