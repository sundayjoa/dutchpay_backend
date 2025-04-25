import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class usersService {
    constructor(private readonly prisma: PrismaService) {}

    async findByKakaoId(kakaoId: string) {
        return this.prisma.user.findUnique({
            where: { kakaoId },
        });
    }

    async createKakaoUser(data: {
        kakaoId: string;
        nickname: string;
        profileImage?: string;
    }) {
        return this.prisma.user.create({ data });
    }
}