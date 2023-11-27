import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserSerivce } from 'src/user/user.service';
import { ProjectService } from 'src/project/project.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, UserSerivce, ProjectService],
  imports: [PrismaModule]
})
export class TaskModule {}
