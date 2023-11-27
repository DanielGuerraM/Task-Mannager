import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, ProjectStatus, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(data: CreateProjectDto){
    return await this.prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        status: ProjectStatus.to_start,
        progress: data.progress,
        start_date: data.start_date,
        finish_date: data.finish_date
      }
    })
  }

  async getAllProjects() {
    return await this.prisma.project.findMany();
  }

  async getProjectById(id: string) {
    return await this.prisma.project.findUnique({
      where:{
        id: id
      }
    });
  }

  async getTaskCount(id: string) {
    return await this.prisma.task.count({ where: { project_id: id } });
  }

  async updateProject(id: string, data: UpdateProjectDto) {
    return await this.prisma.project.update({ where: { id: id }, data : data });
  }
}
