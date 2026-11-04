import { applyDecorators, HttpStatus, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ApiErrorResponseDto } from '../dto/api-error-response.dto.js';

/**
 * Documents the `{ message, data? }` envelope that `@ResponseMessage()` adds.
 * Swagger cannot read generic classes, so the schema is built by hand.
 *
 * @example
 * @ApiMessageResponse(HttpStatus.CREATED, Product, 'Product created')
 * @ApiMessageResponse(HttpStatus.OK) // action without data → { message }
 */
export function ApiMessageResponse(
  status: HttpStatus,
  model?: Type<unknown>,
  description?: string,
) {
  const response = ApiResponse({
    status,
    description,
    schema: {
      type: 'object',
      required: ['message'],
      properties: {
        message: { type: 'string' },
        ...(model && { data: { $ref: getSchemaPath(model) } }),
      },
    },
  });

  return model
    ? applyDecorators(ApiExtraModels(model), response)
    : applyDecorators(response);
}

/**
 * Documents a `PaginatedResult<T>`: `{ page, size, count, rows: T[] }`.
 *
 * @example
 * @ApiPaginatedResponse(Product)
 */
export function ApiPaginatedResponse(model: Type<unknown>) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status: HttpStatus.OK,
      schema: {
        type: 'object',
        required: ['page', 'size', 'count', 'rows'],
        properties: {
          page: { type: 'integer', example: 1 },
          size: { type: 'integer', example: 10 },
          count: { type: 'integer', example: 42 },
          rows: { type: 'array', items: { $ref: getSchemaPath(model) } },
        },
      },
    }),
  );
}

/** Documents error statuses with the body written by `AllExceptionsFilter`. */
export function ApiErrorResponses(...statuses: HttpStatus[]) {
  return applyDecorators(
    ...statuses.map((status) =>
      ApiResponse({ status, type: ApiErrorResponseDto }),
    ),
  );
}
