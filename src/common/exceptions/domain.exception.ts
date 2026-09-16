import {
  HttpException,
  type HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

/**
 * Business rule violation: the status plus the text the client shows.
 * The message comes from the module catalog (`<feature>.exception-response.ts`) or, for a
 * one-off or dynamic case, is written inline.
 *
 * @example
 * throw new DomainException(HttpStatus.NOT_FOUND, SupplierExceptionResponse.NOT_FOUND);
 * throw new DomainException(HttpStatus.NOT_FOUND, `Supplier ${id} not found`);
 * throw new DomainException(HttpStatus.BAD_GATEWAY, message, { cause: error });
 */
export class DomainException extends HttpException {
  constructor(
    statusCode: HttpStatus,
    message: string,
    options?: HttpExceptionOptions,
  ) {
    super(message, statusCode, options);
  }
}
