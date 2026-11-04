import { ApiProperty } from '@nestjs/swagger';

import type { ApiErrorResponse } from '../interfaces/api-response.interface.js';

/** Swagger schema of the body written by `AllExceptionsFilter`. */
export class ApiErrorResponseDto implements ApiErrorResponse {
  @ApiProperty({ example: 404 })
  statusCode!: number;

  @ApiProperty({
    description: '`string[]` when the error comes from `ValidationPipe`',
    oneOf: [
      { type: 'string', example: 'Resource not found' },
      { type: 'array', items: { type: 'string' } },
    ],
  })
  message!: string | string[];

  @ApiProperty({ example: '2026-09-16T15:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({
    example: '/api/v1/<resource>/7c0e1a2b-3c4d-4e5f-8a9b-0c1d2e3f4a5b',
  })
  path!: string;
}
