import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('DevOps Education Platform API')
    .setDescription(
      'Complete API documentation for the DevOps Education Platform microservices',
    )
    .setVersion('2.0.0')
    .addTag('Health', 'Health check endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Classes', 'Classroom management endpoints')
    .addTag('Activities', 'Activity management endpoints')
    .addTag('Students', 'Student management endpoints')
    .addTag('Teachers', 'Teacher management endpoints')
    .addTag('Parents', 'Parent management endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
    customCss: `.topbar { display: none; }
               .swagger-ui { --topbar-bg: #1a1a1a; }`,
    customSiteTitle: 'DevOps Education API',
  });
}
