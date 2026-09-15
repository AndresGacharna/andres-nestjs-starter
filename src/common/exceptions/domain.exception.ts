import { HttpException } from '@nestjs/common';

import type { ErrorDefinition } from '../interfaces/error-definition.interface.js';

/**
 * Business rule violation. Takes an entry of an error catalog so the client
 * always gets a stable `code` to rely on instead of comparing messages.
 *
 * @example
 * throw new DomainException(SupplierErrors.NOT_FOUND);
 * throw new DomainException(SupplierErrors.NOT_FOUND, `Supplier ${id} not found`);
 */
export class DomainException extends HttpException {
  readonly code: string;

  constructor(error: ErrorDefinition, message: string = error.message) {
    super({ code: error.code, message }, error.status);
    this.code = error.code;
  }
}
