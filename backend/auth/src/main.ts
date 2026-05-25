import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('API d\'authentification pour l\'application de gestion d\'autisme')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Activer CORS
  app.enableCors();

  // Écoute sur le port HTTP 3001
  await app.listen(3001, '0.0.0.0');

  console.log(`Auth service is running on ${await app.getUrl()}`);
}
bootstrap();

