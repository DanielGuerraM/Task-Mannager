import { Controller, Body, Post, Get, Put, Delete, BadRequestException, Query } from "@nestjs/common";
import { user } from "@prisma/client";

import { UserSerivce } from "./user.service";
import { hashPassword } from "src/utils";

@Controller('api/admin/user')
export class UserController {
 
  constructor(private userService: UserSerivce) {}

  @Post()
  async createUser(@Body() data: user) {

    if(!data.user_name) {
      throw new BadRequestException('user_name are required')
    }

    if(!data.names) {
      throw new BadRequestException('names are required')
    }

    if(!data.last_names) {
      throw new BadRequestException('last_name are required')
    }

    if(!data.email) {
      throw new BadRequestException('email are required')
    }

    if(!data.password) {
      throw new BadRequestException('password are required')
    }

    if(data.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const existingUserName = await this.userService.getUserByUserName(data.user_name);

    if(existingUserName) {
      throw new BadRequestException(`The user_name ${data.user_name} already exists`);
    }

    const existingEmail = await this.userService.getUserByEmail(data.email);
      
    if(existingEmail) {
      throw new BadRequestException('The user is already registered');
    }

    const hashedPassword = await hashPassword(data.password);

    data.password = hashedPassword;

    const newUser = await this.userService.createUser(data);
    return { result: newUser };
  }
  
  @Get()
  async getAllUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    const users = await this.userService.getAllUsers(Number(page), Number(limit))
    
    return {
      pagging: {
        page: Number(page),
        limit: Number(limit),
        total: users.length
      },
      result: users
    };
  }
}