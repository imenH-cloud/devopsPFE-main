import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Education Platform - User Service')
    .setDescription('API documentation for the User microservice')
    .setVersion('1.0')
    .addTag('user')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  // Écoute sur le port HTTP 3002
  await app.listen(3002, '0.0.0.0');

  console.log(`User service is running on ${await app.getUrl()}`);
}
bootstrap();
