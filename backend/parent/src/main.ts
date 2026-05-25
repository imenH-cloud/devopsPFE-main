import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Parent Service')
    .setDescription('API pour la gestion des parents')
    .setVersion('1.0')
    .addTag('parents')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());

  // Parent service écoute sur 3004
  const port = process.env.PORT || 3004;
  await app.listen(port, '0.0.0.0');

  console.log(`Parent Service is running at http://localhost:${port}`);
  console.log(`Swagger is available at http://localhost:${port}/api`);
}
bootstrap();
