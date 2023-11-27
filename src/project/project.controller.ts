import { Controller, Body, Post, Get, Patch, Param, BadRequestException, NotFoundException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Controller('api/admin/project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  async createProject(@Body() data: CreateProjectDto) {
    if(!data.title) {
      throw new BadRequestException('title is required');
    }

    if(!data.description) {
      throw new BadRequestException('description is required');
    }

    if(!data.progress) {
      throw new BadRequestException('progress is required');
    }

    if(!data.start_date) {
      throw new BadRequestException('start_date is required');
    }

    if(!data.finish_date) {
      throw new BadRequestException('finish_date is required');
    }

    const newProject = await this.projectService.createProject(data);

    return newProject;
  }

  @Get()
  async getAllProjects() {
    return { result: await this.projectService.getAllProjects() };
  }

  @Get('/count/:id')
  async getTaskCount(@Param('id') id: string) {
    const project = await this.projectService.getProjectById(id);

    if(!project) {
      throw new NotFoundException('Project does not exists');
    }

    return { result: { total: await this.projectService.getTaskCount(id) } }
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    const project = await this.projectService.getProjectById(id);

    if(!project) { 
      throw new NotFoundException('The project does not exists');
    }

    return { result: project }
  }

  @Patch(':id') 
  async updateProject(@Param('id') id: string, @Body() data: UpdateProjectDto) {
    const project = await this.projectService.getProjectById(id);

    if(!project) {
      throw new NotFoundException('The project does not exists');
    }

    if(data.status === 'Completed' && Number(project.progress) < 100) {
      throw new BadRequestException('You cannot mark a project as completed if the progress is less than 100%');
    }

    const updatedProject = Object.assign(project, data);

    return { result: await this.projectService.updateProject(id, data) }
  }
}
