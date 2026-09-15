import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator.js';
import type { MessageResponse } from '../interfaces/api-response.interface.js';

/**
 * - Handlers without `@ResponseMessage()` (queries: GET, or POST with
 *   pagination/filters in the body) return their result as-is.
 * - Handlers with `@ResponseMessage()` (actions) return `{ message, data? }`;
 *   `data` is omitted when the handler returns nothing.
 */
@Injectable()
export class ResponseMessageInterceptor<T> implements NestInterceptor<
  T,
  T | MessageResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | MessageResponse<T>> {
    // Read on the way in: on the way out `map` only receives the handler result
    const message = this.reflector.getAllAndOverride<string | undefined>(
      RESPONSE_MESSAGE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (message === undefined) {
      return next.handle();
    }

    return next
      .handle()
      .pipe(map((data) => ({ message, ...(data !== undefined && { data }) })));
  }
}
