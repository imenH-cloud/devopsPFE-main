import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from './dto/auth-user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  // Récupère l'utilisateur depuis le microservice user par email
  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3002';
      console.log('Fetching user from:', `${userServiceUrl}/user/email/${email}`);
      const response = await firstValueFrom(
        this.httpService.get(`${userServiceUrl}/user/email/${email}`)
      );
      const user = response.data;
      console.log('User fetched:', user);

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      // Compare le mot de passe fourni avec le hash récupéré
      let passwordMatches = false;
      console.log('Password from DB:', user.password);
      console.log('Password provided:', pass);
      console.log('Password starts with $2?', user.password && user.password.startsWith('$2'));
      
      if (user.password && user.password.startsWith('$2')) {
        // Bcrypt hash
        console.log('Using bcrypt comparison');
        passwordMatches = await bcrypt.compare(pass, user.password);
      } else {
        // Plaintext comparison for testing/development
        console.log('Using plaintext comparison');
        passwordMatches = pass === user.password;
      }
      console.log('Password matches result:', passwordMatches);

      if (!passwordMatches) {
        throw new UnauthorizedException('Email et/ou mot de passe sont incorrects');
      }

      return user;
    } catch (error) {
      console.error('Auth validation error:', error.message || error);
      throw new UnauthorizedException('Email et/ou mot de passe sont incorrects');
    }
  }

  // Login : valide l'utilisateur et génère un token JWT
  async login(user: AuthUserDto) {
    const userData = await this.validateUser(user.email, user.password);

    const payload = {
      id: userData.id,
      email: userData.email,
    };

    const expiresIn = user.rememberMe ? 24 * 60 * 60 : 2 * 60 * 60;

    return {
      idUser: userData.id,
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn,
      }),
    };
  }
}
