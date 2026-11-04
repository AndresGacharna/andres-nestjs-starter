import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { PaginationDto } from './pagination.dto.js';

/**
 * Body of a paginated query: `{ pagination, filter }`.
 * Each module extends it and redeclares `filter` with its own `@Type()`,
 * because class-transformer cannot resolve a generic at runtime.
 *
 * @example
 * export class ProductPagedDto extends PagedDto<ProductFilterDto> {
 *   @ApiPropertyOptional({ type: ProductFilterDto })
 *   @IsOptional()
 *   @ValidateNested()
 *   @Type(() => ProductFilterDto)
 *   declare filter?: ProductFilterDto;
 * }
 */
export abstract class PagedDto<TFilter> {
  @ApiPropertyOptional({ type: PaginationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationDto)
  // `null` means "not sent": page 1, default size
  @Transform(({ value }) => value ?? new PaginationDto())
  pagination: PaginationDto = new PaginationDto();

  declare filter?: TFilter;
}
