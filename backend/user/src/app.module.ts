// Ajout conditionnel de crypto global
if (!globalThis.crypto) {
  (globalThis as any).crypto = require('crypto');
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { MetricsController } from './metrics/metrics.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HealthController } from './health.controller'; // âœ… AJOUT

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

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
        synchronize: true,
      }),
    }),

    UserModule,
  ],
  controllers: [
    AppController,
    HealthController, // âœ… AJOUT
  ],
  providers: [AppService],
})
export class AppModule {}

