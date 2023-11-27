import { Injectable } from '@nestjs/common';
import { role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async createRole(data: role){
    return await this.prisma.role.create({ data: data });
  }

  async getAllRoles() {
    return await this.prisma.role.findMany();
  }

  async getRoleById(id: number) {
    return await this.prisma.role.findUnique({ where: { id: id } });
  }

  async getRoleByName(name: string) {
    return await this.prisma.role.findFirst({ where: { name: name } });
  }
}
