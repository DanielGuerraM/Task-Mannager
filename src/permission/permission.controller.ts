import { Controller, Post, Get, Body, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { AssignPermissionsDto, CreatePermissionDto, PermissionsDto } from './dto/permission.dto';
import { generateRandom } from 'src/utils';
import { RoleService } from 'src/role/role.service';

@Controller('api/admin/permission')
export class PermissionController {
  
  constructor(private permissionService: PermissionService, private roleService: RoleService) {}

  
  @Post()
  async createPermission(@Body() data: CreatePermissionDto) {
    const id = await generateRandom();
    const expression = /\s|[A-Z]/;

    if(expression.test(data.name)) {
      throw new BadRequestException('The name cannot contain spaces or capital letters');
    }

    if(!data.name) {
      throw new BadRequestException('name is required');
    }

    data.id = id;

    return { result: await this.permissionService.createPermission(data) }
  }

  @Get()
  async getAllPermissions() {
    return { result: await this.permissionService.getAllPermissions() }
  }

  @Get('/assign/:id')
  async getPermissionsByRole(@Param('id') id: number) {
    return { result: { assigned: await this.permissionService.getPermissionsByRole(id) } }
  }

  @Post('/assign')
  async assignPermissions(@Body() data: PermissionsDto) {

    let newAssigns: AssignPermissionsDto[] = [];
    let removeAssigns: number[] = [];

    if(data?.assign?.length > 0) {

      for(const assign of data.assign) {

        if(!assign.permission_id) {
          throw new BadRequestException('The permission_id is required');
        }

        if(!assign.role_id) {
          throw new BadRequestException('The role_id is required');
        }

        const role = await this.roleService.getRoleById(assign.role_id);

        if(!role) {
          throw new NotFoundException(`The role_id ${assign.role_id} does not exist`);
        }

        const permission = await this.permissionService.getPermissionById(assign.permission_id);

        if(!permission) {
          throw new NotFoundException(`The permission_id ${assign.permission_id} does not exist`);
        }

        const alreadyExistsAssign = await this.permissionService.getAssigned(assign.role_id, assign.permission_id);

        if(alreadyExistsAssign){
          throw new BadRequestException(`Permission ${assign.permission_id} is already assigned to role ${assign.role_id}`);
        }

        assign.id = await generateRandom();

        newAssigns.push(assign);
      }
    }

    if(data?.remove?.length > 0) {

      for(const assign of data.remove) {
        
        const existingAssign = await this.permissionService.getAssignmentById(assign);

        if(!existingAssign) {
          throw new NotFoundException(`The assignment ${assign} does not exist`);
        }

        removeAssigns.push(existingAssign.id);
      }
    }

    if(newAssigns.length > 0) {
      await this.permissionService.assignManyPermissions(newAssigns);
    }

    if(removeAssigns.length > 0) {
      await this.permissionService.removeManyPermissions(removeAssigns);
    }

    return {
      result: {
        assign: newAssigns,
        remove: removeAssigns
      }
    }
  }
}