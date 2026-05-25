
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      
      jest.spyOn(httpService, 'get').mockImplementation(() => 
        of({ data: mockUser, status: 200 } as any)
      );

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw new Error('User not found');
      });

      await expect(service.validateUser('test@example.com', 'password')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('login', () => {
    it('should return user id and access token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({ 
        email: 'test@example.com', 
        password: 'password',
        rememberMe: true
      });
      
      expect(result).toEqual({
        idUser: 1,
        access_token: 'test-token',
      });
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: 1, email: 'test@example.com' },
        { secret: expect.any(String), expiresIn: 24 * 60 * 60 },
      );
    });

    it('should use shorter expiration time when rememberMe is false', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await service.login({ 
        email: 'test@example.com', 
        password: 'password',
        rememberMe: false
      });
      
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: 1, email: 'test@example.com' },
        { secret: expect.any(String), expiresIn: 2 * 60 * 60 },
      );
    });
  });
});
