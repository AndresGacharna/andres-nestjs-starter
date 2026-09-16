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

import { CommonExceptionResponse } from '../constants/common.exception-response.js';
import { PostgresErrorCode } from '../constants/postgres-error-codes.js';
import { DomainException } from '../exceptions/domain.exception.js';
import type { ApiErrorResponse } from '../interfaces/api-response.interface.js';

type ResolvedError = Pick<ApiErrorResponse, 'statusCode' | 'message'>;

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message } = this.resolve(exception);

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ApiErrorResponse = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      // `path` excludes the query string, which may carry sensitive values
      path: request.path,
    };

    response.status(statusCode).json(body);
  }

  private resolve(exception: unknown): ResolvedError {
    // The message was written on purpose for the client, even on a 5xx
    if (exception instanceof DomainException) {
      return this.build(exception.getStatus(), exception.message);
    }

    if (exception instanceof HttpException) {
      return this.resolveHttpException(exception);
    }

    if (exception instanceof QueryFailedError) {
      return this.resolveQueryFailedError(exception);
    }

    if (exception instanceof EntityNotFoundError) {
      return this.build(
        HttpStatus.NOT_FOUND,
        CommonExceptionResponse.NOT_FOUND,
      );
    }

    return this.build(
      HttpStatus.INTERNAL_SERVER_ERROR,
      CommonExceptionResponse.INTERNAL_ERROR,
    );
  }

  private resolveHttpException(exception: HttpException): ResolvedError {
    const statusCode = exception.getStatus();

    // Nest and third-party 5xx exceptions may carry internal details
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      return this.build(statusCode, CommonExceptionResponse.INTERNAL_ERROR);
    }

    // ValidationPipe puts the list of constraint errors in `message`
    const response = exception.getResponse();
    const message =
      typeof response === 'object' && 'message' in response
        ? (response.message as string | string[])
        : exception.message;

    return this.build(statusCode, message);
  }

  // Never expose raw driver messages: they leak table and constraint names
  private resolveQueryFailedError(exception: QueryFailedError): ResolvedError {
    const { code } = exception.driverError as { code?: string };

    switch (code) {
      case PostgresErrorCode.UNIQUE_VIOLATION:
        return this.build(
          HttpStatus.CONFLICT,
          CommonExceptionResponse.UNIQUE_VIOLATION,
        );
      case PostgresErrorCode.FOREIGN_KEY_VIOLATION:
        return this.build(
          HttpStatus.CONFLICT,
          CommonExceptionResponse.FOREIGN_KEY_VIOLATION,
        );
      default:
        return this.build(
          HttpStatus.INTERNAL_SERVER_ERROR,
          CommonExceptionResponse.INTERNAL_ERROR,
        );
    }
  }

  private build(statusCode: number, message: string | string[]): ResolvedError {
    return { statusCode, message };
  }
}
