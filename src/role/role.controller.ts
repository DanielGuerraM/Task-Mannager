import { Controller, Post, Get, Patch, Delete, Param, Body, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { RoleService } from './role.service';
import { role } from '@prisma/client';
import { generateRandom } from 'src/utils';

@Controller('api/admin/role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  async createRole(@Body() data: role) {
    if(!data.name) {
      throw new BadRequestException('The name is required');
    }
    
    const role = await this.roleService.getRoleByName(data.name);

    if(role) {
      throw new BadRequestException(`The role ${data.name} already exists`);
    }

    const id = await generateRandom();

    data.id = id;

    return { result: await this.roleService.createRole(data) }
  }

  @Get()
  async getAllRoles() {
    return { result: await this.roleService.getAllRoles() };
  }
}
