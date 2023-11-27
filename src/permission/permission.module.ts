import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleService } from 'src/role/role.service';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, RoleService],
  imports: [PrismaModule]
})
export class PermissionModule {}
