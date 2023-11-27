import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserSerivce } from "./user.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  controllers: [UserController],
  providers: [UserSerivce],
  imports: [PrismaModule]
})
export class UserModule {}