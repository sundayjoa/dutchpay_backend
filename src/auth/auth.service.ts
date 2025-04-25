import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { usersService } from '../users/users.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: usersService,
  ) {}

  async kakaoLogin(code: string, codeVerifier: string): Promise<{ accessToken: string }> {
    const KAKAO_CLIENT_ID = this.configService.get('KAKAO_CLIENT_ID');
    const KAKAO_REDIRECT_URI = this.configService.get('KAKAO_REDIRECT_URI');

    // 인가 코드로 토큰 요청
    const tokenResponse = await axios.post(
      'https://kauth.kakao.com/oauth/token', 
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: KAKAO_CLIENT_ID,
          redirect_uri: KAKAO_REDIRECT_URI,
          code,
          code_verifier: codeVerifier,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const access_token = tokenResponse.data.access_token;

    // 사용자 정보 요청
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const kakaoAccount = userResponse.data.kakao_account;
    const kakaoId = userResponse.data.id.toString();
    const nickname = kakaoAccount.profile?.nickname;
    const profileImage = kakaoAccount.profile?.profile_image_url;

    // DB 조회
    let user = await this.usersService.findByKakaoId(kakaoId);

    // 사용자 없으면 새로 생성
    if (!user) {
      user = await this.usersService.createKakaoUser({
        kakaoId,
        nickname: nickname,
        profileImage: profileImage ?? undefined, 
      });
    }

    // JWT 발급
    const payload = { sub: kakaoId, nickname: user.nickname };
    const jwt = this.jwtService.sign(payload);

    return { accessToken: jwt };
  }
}
