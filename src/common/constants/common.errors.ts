import { HttpStatus } from '@nestjs/common';

import type { ErrorDefinition } from '../interfaces/error-definition.interface.js';

// Cross-cutting errors only. Feature errors live in `<feature>/constants/<feature>.errors.ts`.
export const CommonErrors = {
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error has occurred',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    status: HttpStatus.BAD_REQUEST,
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Resource not found',
    status: HttpStatus.NOT_FOUND,
  },
  UNIQUE_VIOLATION: {
    code: 'UNIQUE_VIOLATION',
    message: 'Resource already exists',
    status: HttpStatus.CONFLICT,
  },
  FOREIGN_KEY_VIOLATION: {
    code: 'FOREIGN_KEY_VIOLATION',
    message: 'Related resource does not exist or is still in use',
    status: HttpStatus.CONFLICT,
  },
} as const satisfies Record<string, ErrorDefinition>;
