import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * Single source of truth for environment variables. Properties with an
 * initializer are optional and use that value as default; the rest are required.
 * Read them through `ConfigService<EnvironmentVariables, true>`, never `process.env`.
 *
 * Keep the explicit types even when a default exists: the implicit conversion
 * ('5432' -> 5432) relies on the emitted type metadata, which is `Object` for
 * inferred types.
 */
export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3033;

  @IsUrl({ require_tld: false, require_protocol: true })
  FRONT_HOST!: string;

  @IsString()
  @IsNotEmpty()
  DB_HOST!: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  DB_PORT: number = 5432;

  @IsString()
  @IsNotEmpty()
  DB_USER!: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME!: string;

  @IsString()
  @IsNotEmpty()
  PG_SCHEMA: string = 'public';

  @IsOptional()
  @IsString()
  PG_SSL_CA?: string;

  @IsInt()
  @Min(1)
  DB_POOL_SIZE: number = 10;
}

/** Fails fast on startup, listing every missing or invalid variable. */
export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const env = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(env, { skipMissingProperties: false });

  if (errors.length > 0) {
    const details = errors
      .map(
        (error) =>
          `  - ${error.property}: ${Object.values(error.constraints ?? {}).join(', ')}`,
      )
      .join('\n');
    throw new Error(`Invalid environment variables:\n${details}`);
  }

  return env;
}
