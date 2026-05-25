import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { initializeDatabase } from './database/init';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize database after app startup
  try {
    const dataSource = app.get(DataSource);
    if (dataSource && dataSource.isInitialized) {
      await initializeDatabase(dataSource);
    }
  } catch (error) {
    console.warn('DataSource initialization warning:', error.message);
  }

  const config = new DocumentBuilder()
    .setTitle('Activity Service')
    .setDescription('API pour la gestion des activités')
    .setVersion('1.0')
    .addTag('activities')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(3003, '0.0.0.0');
  console.log('Activity service running on port 3003');
}
bootstrap();
