import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

import { CommonErrors } from '../constants/common.errors.js';
import { PostgresErrorCode } from '../constants/postgres-error-codes.js';
import { DomainException } from '../exceptions/domain.exception.js';
import type { ApiErrorResponse } from '../interfaces/api-response.interface.js';
import type { ErrorDefinition } from '../interfaces/error-definition.interface.js';

type ResolvedError = Pick<ApiErrorResponse, 'statusCode' | 'code' | 'message'>;

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, code, message } = this.resolve(exception);

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ApiErrorResponse = {
      statusCode,
      code,
      message,
      timestamp: new Date().toISOString(),
      // `path` excludes the query string, which may carry sensitive values
      path: request.path,
    };

    response.status(statusCode).json(body);
  }

  private resolve(exception: unknown): ResolvedError {
    if (exception instanceof DomainException) {
      return {
        statusCode: exception.getStatus(),
        code: exception.code,
        message: exception.message,
      };
    }

    if (exception instanceof HttpException) {
      return this.resolveHttpException(exception);
    }

    if (exception instanceof QueryFailedError) {
      return this.resolveQueryFailedError(exception);
    }

    if (exception instanceof EntityNotFoundError) {
      return this.fromDefinition(CommonErrors.NOT_FOUND);
    }

    return this.fromDefinition(CommonErrors.INTERNAL_ERROR);
  }

  private resolveHttpException(exception: HttpException): ResolvedError {
    const statusCode = exception.getStatus();
    const response = exception.getResponse();

    // ValidationPipe puts the list of constraint errors in `message`
    const message =
      typeof response === 'object' && 'message' in response
        ? (response.message as string | string[])
        : exception.message;

    return {
      statusCode,
      code: Array.isArray(message)
        ? CommonErrors.VALIDATION_ERROR.code
        : (HttpStatus[statusCode] ?? CommonErrors.INTERNAL_ERROR.code),
      message,
    };
  }

  // Never expose raw driver messages: they leak table and constraint names
  private resolveQueryFailedError(exception: QueryFailedError): ResolvedError {
    const { code } = exception.driverError as { code?: string };

    switch (code) {
      case PostgresErrorCode.UNIQUE_VIOLATION:
        return this.fromDefinition(CommonErrors.UNIQUE_VIOLATION);
      case PostgresErrorCode.FOREIGN_KEY_VIOLATION:
        return this.fromDefinition(CommonErrors.FOREIGN_KEY_VIOLATION);
      default:
        return this.fromDefinition(CommonErrors.INTERNAL_ERROR);
    }
  }

  private fromDefinition(error: ErrorDefinition): ResolvedError {
    return {
      statusCode: error.status,
      code: error.code,
      message: error.message,
    };
  }
}
