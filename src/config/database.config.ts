import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Environment, type EnvironmentVariables } from './env.validation.js';

export function buildTypeOrmOptions(
  config: ConfigService<EnvironmentVariables, true>,
): TypeOrmModuleOptions {
  const sslCa = config.get('PG_SSL_CA', { infer: true });

  return {
    type: 'postgres',
    host: config.get('DB_HOST', { infer: true }),
    port: config.get('DB_PORT', { infer: true }),
    username: config.get('DB_USER', { infer: true }),
    password: config.get('DB_PASSWORD', { infer: true }),
    database: config.get('DB_NAME', { infer: true }),
    schema: config.get('PG_SCHEMA', { infer: true }),
    ssl: {
      rejectUnauthorized: Boolean(sslCa),
      ca: sslCa?.replace(/\\n/g, '\n') ?? '',
    },
    autoLoadEntities: true,
    synchronize:
      config.get('NODE_ENV', { infer: true }) === Environment.Development,
    applicationName: 'andres-nestjs-starter',

    // Pool options of node-postgres (pg-pool). `poolSize` is mapped to `max`.
    poolSize: config.get('DB_POOL_SIZE', { infer: true }),
    connectTimeoutMS: 5_000,
    extra: {
      idleTimeoutMillis: 30_000,
      options: '-c TimeZone=UTC',
    },
  };
}
