import {
  Controller, 
  Body, 
  Param, 
  Post, 
  Get, 
  Delete, 
  Patch, 
  Query, 
  BadRequestException, 
  NotFoundException, 
  InternalServerErrorException
} from '@nestjs/common';

import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { ProjectService } from 'src/project/project.service';
import { UserSerivce } from 'src/user/user.service';

@Controller('api/admin/task')
export class TaskController {
  
  constructor(private taskService: TaskService, private userService: UserSerivce, private projectService: ProjectService) {}

  @Get()
  async getAllTasks(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    const numPage = parseInt(page, 10)
    const numLimit = parseInt(limit, 10)

    if(numPage < 0) {
      throw new BadRequestException('The page cannot be less than 1');
    }

    if(numLimit < 0 || numLimit > 50) {
      throw new BadRequestException('The limit cannot be less than 1 or greater than 50');
    }

    return {
      paging: {
        page: numPage,
        limit: numLimit
      },
      result: await this.taskService.getAllTaks(numPage, numLimit)
    }
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    const existingTask = await this.taskService.getTaskById(id);

    if(!existingTask) {
      throw new NotFoundException('The task does not exists.');
    }

    return { result: existingTask }
  }

  @Post()
  async createANewTask(@Body() data: CreateTaskDto) {
    if(!data.title) {
      throw new BadRequestException('The title is required');
    }

    if(!data.description) {
      throw new BadRequestException('The description is required');
    }

    if(!data.expiration_date) {
      throw new BadRequestException('The expiration_date is required');
    }

    if(!data.user_id) {
      throw new BadRequestException('The user_id is required');
    }

    if(!data.project_id) {
      throw new BadRequestException('The project_id is required');
    }

    const existingTask = await this.userService.getUserById(data.user_id);

    if(!existingTask) {
      throw new NotFoundException('User does not exists');
    }

    const existingProject = await this.projectService.getProjectById(data.project_id);

    if(!existingProject) {
      throw new NotFoundException('Project does not exists');
    }

    if(existingProject.status === 'Completed') {
      throw new BadRequestException('You cannot create more tasks since the project is completed');
    }

    const numTasks = await this.taskService.getNumberOfTasksByProjectId(data.project_id);

    if(numTasks === 0) {
      return { result: this.taskService.createANewTask(data) };
    }

    const completedTasks = await this.taskService.getTasksCompletedByProjectId(data.project_id);

    if(completedTasks.length === 0) {
      return { result: this.taskService.createANewTask(data) }
    }

    const newProgress = (100 / (numTasks + 1)) * completedTasks.length;
    await this.taskService.updateProjectProgress(data.project_id, (newProgress));

    return { result: await this.taskService.createANewTask(data) }
  }

  @Patch(':id')
  async updateTasks(@Param('id') id: string, @Body() data: UpdateTaskDto) {
    try {
      const existingTask = await this.taskService.getTaskById(id);

      if(!existingTask) {
        throw new NotFoundException('Task does not exists');
      }

      if(data.status === 'Completed' && existingTask.status !== 'Completed') {
        const completedTasks = await this.taskService.getTasksCompletedByProjectId(existingTask.project_id);
        const numberOfTasks = await this.taskService.getNumberOfTasksByProjectId(existingTask.project_id);

        if(completedTasks.length > 0) {
          const progress = (100 / numberOfTasks) * completedTasks.length;
          await this.taskService.updateProjectProgress(existingTask.project_id, (progress + (100 / numberOfTasks)));
        }
        else {
          await this.taskService.updateProjectProgress(existingTask.project_id, (100 / numberOfTasks));
        }
      }

      const updatedTask = Object.assign(existingTask, data);

      return { result: await this.taskService.updateTask(id, updatedTask) }
    }
    catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    const task = await this.taskService.getTaskById(id);

    if(!task) {
      throw new NotFoundException('The task does not exists');
    }

    if(task.status === 'Completed') {
      throw new BadRequestException("Can't delete a completed task");
    }

    const completedTasks = await this.taskService.getTasksCompletedByProjectId(task.project_id);

    if(completedTasks.length > 0) {
      const numTasks = await this.taskService.getNumberOfTasksByProjectId(task.project_id);
      const newProgress = (100 / (numTasks - 1)) * completedTasks.length;
      await this.taskService.updateProjectProgress(task.project_id, newProgress);
    }

    return { result: await this.taskService.deleteTask(id) }
  }
}
