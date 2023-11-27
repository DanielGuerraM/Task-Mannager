import { Injectable } from "@nestjs/common";
import { user } from "@prisma/client";

import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserSerivce {
  
  constructor(private prisma: PrismaService) {}
    async getUserByUserName(userName: string) {
      return await this.prisma.user.findFirst({ where: { user_name: userName } });
    }

    async getUserByEmail(email: string) {
      return await this.prisma.user.findFirst({ where: { email: email } })
    }

    async createUser(data: user) {
      return await this.prisma.user.create({ data: data });
    }

    async getAllUsers(page: number, limit: number) {
      return await this.prisma.user.findMany({
        take: limit,
        skip: (page - 1) * limit
      });
    }

    async getUserById(id: string) {
      return await this.prisma.user.findUnique({ where:{ id: id } });
    }
}