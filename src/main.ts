import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import type { EnvironmentVariables } from './config/env.validation.js';

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
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: false,
  });

  await app.listen(config.get('PORT', { infer: true }));

  Logger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}

await bootstrap();
