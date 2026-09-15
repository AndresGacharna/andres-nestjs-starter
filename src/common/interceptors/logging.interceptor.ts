import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const { method, url } = http.getRequest<Request>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = http.getResponse<Response>();
          this.logger.log(
            `${method} ${url} ${statusCode} - ${Date.now() - startedAt}ms`,
          );
        },
        // Stack traces for 5xx are logged by AllExceptionsFilter
        error: (error: unknown) => {
          const statusCode =
            error instanceof HttpException
              ? error.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR;
          this.logger.warn(
            `${method} ${url} ${statusCode} - ${Date.now() - startedAt}ms`,
          );
        },
      }),
    );
  }
}
