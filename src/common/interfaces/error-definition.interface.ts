import type { HttpStatus } from '@nestjs/common';

/**
 * A single error of the catalog: what the client receives and with which status.
 * Keeping the three together prevents a code from drifting away from its status.
 */
export interface ErrorDefinition {
  readonly code: string;
  readonly message: string;
  readonly status: HttpStatus;
}
