import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from './common/common.module.js';
import { buildTypeOrmOptions } from './config/database.config.js';
import { validateEnv } from './config/env.validation.js';
import { ProductModule } from './product/product.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: buildTypeOrmOptions,
    }),
    CommonModule,

    // Módulos de negocio. `ProductModule` es el ejemplo de la plantilla:
    // bórralo cuando escribas el primero real (ver README, "Qué renombrar").
    ProductModule,
  ],
})
export class AppModule {}
