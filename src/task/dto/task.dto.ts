export enum TaskStatus {
  to_start = 'To Start',
  in_process = 'In Process',
  completed = 'Completed',
  cancelled = 'Cancelled'
}

export class CreateTaskDto {
  title: string
  status: TaskStatus
  description: string
  expiration_date: string
  user_id: string
  project_id:string
}

export class UpdateTaskDto {
  title?: string
  status?: TaskStatus
  description?: string
  expiration_date?: string
}