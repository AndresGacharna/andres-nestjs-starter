import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module.js';
import {
  Environment,
  type EnvironmentVariables,
} from './config/env.validation.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  process.env.TZ = 'America/Bogota';

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: [config.get('FRONT_HOST', { infer: true })],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false,
    // Cross-origin, the browser hides it otherwise: the front reads the
    // downloaded file's name from it
    exposedHeaders: ['Content-Disposition'],
  });

  // API docs outside production only: they expose every route and payload
  if (config.get('NODE_ENV', { infer: true }) !== Environment.Production) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('API')
      .setVersion('1.0')
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, documentFactory);
  }

  await app.listen(config.get('PORT', { infer: true }));

  Logger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}

await bootstrap();
