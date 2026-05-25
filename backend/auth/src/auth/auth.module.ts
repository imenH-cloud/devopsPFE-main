import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local-passport/local.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios'; // Pour HttpService
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';

@Module({
  imports: [
    HttpModule, // Pour faire des requêtes HTTP vers le microservice user
    // Si tu utilises uniquement HttpService dans AuthService, tu peux retirer ClientsModule
    // ClientsModule.register([
    //   {
    //     name: 'USER_SERVICE',
    //     transport: Transport.TCP,
    //     options: {
    //       host: process.env.USER_SERVICE_HOST || '15.236.190.137',
    //       port: parseInt(process.env.USER_SERVICE_PORT || '3001', 10),
    //     },
    //   },
    // ]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600000s' }, // ~166 heures, tu peux réduire si tu veux
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

