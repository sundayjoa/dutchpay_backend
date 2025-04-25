import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "src/users/users.module";
import { JwtStrategy } from "./jwt.stratege";
import { JwtAuthGuard } from "./jwt.guard";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [
        ConfigModule,
        UsersModule,
        HttpModule,
        JwtModule.registerAsync({
            imports: [
                ConfigModule
            ],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '3h'},
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtAuthGuard],
    exports: [ JwtAuthGuard ],
})

export class AuthModule {}