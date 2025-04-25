import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    //인가코드 받은 후 access_token 처리
    @Post('kakao')
    async kakaoLogin(@Body() body: { code: string; codeVerifier: string }) {
      const { code, codeVerifier } = body;
      return this.authService.kakaoLogin(code, codeVerifier);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMyInfo(@Req() req: Request) {
        return req.user;
    }
}