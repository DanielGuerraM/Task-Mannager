export class CreatePermissionDto {
  id: number
  name: string
  description: string
}

export class PermissionsDto {
  assign?: AssignPermissionsDto[]
  remove?: number[]
}

export class AssignPermissionsDto {
  id: number
  role_id: number
  permission_id: number
}