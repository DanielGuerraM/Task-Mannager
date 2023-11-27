export enum ProjectStatus {
  to_start = 'To Start',
  in_process = 'In Process',
  completed = 'Completed',
  cancelled = 'Cancelled'
}

export class UpdateProjectDto {
  title: string
  description: string
  status: ProjectStatus
  start_date: string
  finish_date: string
}

export class CreateProjectDto {
  title: string
  description: string
  status: ProjectStatus
  progress: number
  start_date: string
  finish_date: string
}