import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('EduManage - API Gestion Scolaire')
    .setDescription('Spécification OpenAPI REST v1 - Conforme au Cahier des charges technique')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentification Supabase et gestion de session')
    .addTag('students', 'Gestion des élèves et fiches individuelles')
    .addTag('enrollments', 'Inscriptions scolaires et promotions')
    .addTag('payments', 'Paiements espèces, allocations et annulations')
    .addTag('cash-registers', 'Caisse journalière et clôtures')
    .addTag('reports', 'Tableau de bord et rapports financiers')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`API NestJS démarrée sur le port ${port} avec préfixe /api/v1`);
  logger.log(`Documentation Swagger disponible sur http://localhost:${port}/api/v1/docs`);
}

bootstrap();
