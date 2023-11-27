import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, TaskModule, ProjectModule, PermissionModule, RoleModule, AuthModule],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
