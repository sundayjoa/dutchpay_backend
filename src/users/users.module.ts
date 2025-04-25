import { Module } from '@nestjs/common';
import { usersService } from "./users.service";
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    providers: [usersService, PrismaService],
    exports: [usersService],
})

export class UsersModule {}