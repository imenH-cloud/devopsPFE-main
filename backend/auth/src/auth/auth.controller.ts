import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './auth';

@Controller('auth')
export class AuthController {
   
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authUserDto: AuthUserDto) {
    console.log("authUserDto",authUserDto)
    console.log("Request headers and body type:", typeof authUserDto)
    if(!authUserDto.email || !authUserDto.password) {
      console.error('Missing email or password:', {email: authUserDto.email, password: authUserDto.password})
      return { error: 'Missing credentials', received: authUserDto };
    }
    return this.authService.login(authUserDto);
  }

}
