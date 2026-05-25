import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MetricsController } from './metrics/metrics.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ClassroomModule } from './classroom/classroom.module';

import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST || 'localhost',
          port: process.env.AUTH_SERVICE_PORT ? parseInt(process.env.AUTH_SERVICE_PORT, 10) : 3000,
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || 'localhost',
          port: process.env.USER_SERVICE_PORT ? parseInt(process.env.USER_SERVICE_PORT, 10) : 3002,
        },
      },
    ]),
   TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'postgres'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'education'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),

    ClassroomModule,
    
  ],
  controllers: [AppController, MetricsController],
  providers: [AppService],
})
export class AppModule {}
