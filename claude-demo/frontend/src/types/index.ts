export interface User {
  id: string
  name: string
}

export interface Task {
  id: string
  title: string
  description: string
  created_by: string
  created_at: string
  updated_by: string | null
  updated_at: string | null
  creator: User
  updater: User | null
}

export interface TaskCreate {
  title: string
  description: string
  created_by: string
}

export interface TaskUpdate {
  title?: string
  description?: string
  updated_by: string
}

export interface UserCreate {
  name: string
}

export interface UserUpdate {
  name: string
}
