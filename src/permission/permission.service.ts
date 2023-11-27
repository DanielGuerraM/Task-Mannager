import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignPermissionsDto, CreatePermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async createPermission(data: CreatePermissionDto) {
    return await this.prisma.permission.create({
      data: {
        id: data.id,
        name: data.name,
        description: data.description
      }
    });
  }

  
  async getAllPermissions() {
    return await this.prisma.permission.findMany();
  }

  async getPermissionById(id: number) {
    return await this.prisma.permission.findUnique({ where: { id: id } })
  }

  async getAssignmentById(id: number){
    return await this.prisma.permission_role.findUnique({
      where: {
        id: id
      }
    })
  }

  async getAssigned(roleId: number, permissionId: number) {
    return await this.prisma.permission_role.findMany({
      where: {
        role_id: roleId,
        permission_id: permissionId
      }
    });
  }

  async getPermissionsByRole(id: number) {
    return await this.prisma.permission_role.findMany({ where: { role_id: Number(id) } });
  }

  async assignManyPermissions(data: AssignPermissionsDto[]) {
    return await this.prisma.permission_role.createMany({ data: data });
  }

  async removeManyPermissions(ids: number[]) {
    return await this.prisma.permission_role.deleteMany({ where: { id: { in: ids }} })
  }
}
