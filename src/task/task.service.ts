import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { TaskStatus, CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAllTaks(page: number, limit: number) {
    return this.prisma.task.findMany({ take: limit, skip: (page - 1) * limit })
  }

  async getTaskById(id: string) {
    return this.prisma.task.findUnique({ where: { id: id } });
  }

  async getNumberOfTasksByProjectId(projectId: string) {
    return this.prisma.task.count({ where: { project_id: projectId } });
  }

  async createANewTask(data: CreateTaskDto){
    return this.prisma.task.create({ data: {
      title: data.title,
      description: data.description,
      expiration_date: data.expiration_date,
      status: TaskStatus.to_start,
      user_id: data.user_id,
      project_id: data.project_id
    } });
  }

  async getTasksCompletedByProjectId(projectId: string) {
    return this.prisma.task.findMany({ where: { project_id: projectId, status: 'Completed' } });
  }

  async updateProjectProgress(projectId: string, progress: number) {
    return this.prisma.project.update({ where: { id: projectId }, data: { progress: progress } })
  }

  async updateTask(id: string, data: UpdateTaskDto) {
    return this.prisma.task.update({ where: { id: id }, data: data });
  }

  async deleteTask(id: string) {
    return this.prisma.task.delete({ where: { id: id } });
  }
}
