// Cross-cutting error messages only. Feature messages live in `<feature>/constants/<feature>.exception-response.ts`.
export const CommonExceptionResponse = {
  INTERNAL_ERROR: 'An unexpected error has occurred',
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  NOT_FOUND: 'Resource not found',
  UNIQUE_VIOLATION: 'Resource already exists',
  FOREIGN_KEY_VIOLATION: 'Related resource does not exist or is still in use',
  EXTERNAL_SERVICE_ERROR:
    'An external service is not available, try again later',
} as const;
