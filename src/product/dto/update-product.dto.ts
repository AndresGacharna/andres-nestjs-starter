// From @nestjs/swagger, not @nestjs/mapped-types: it also copies the Swagger metadata
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

import { IsOptionalNotNull } from '../../common/decorators/is-optional-not-null.decorator.js';
import { CreateProductDto } from './create-product.dto.js';

/**
 * `skipNullProperties: false`: only an omitted field is skipped; a `null` is
 * validated and rejected (400) instead of reaching a NOT NULL column (500).
 * `description` keeps its own `@IsOptional()`, so `null` still clears it.
 */
export class UpdateProductDto extends PartialType(CreateProductDto, {
  skipNullProperties: false,
}) {
  @ApiPropertyOptional({ example: false })
  @IsOptionalNotNull()
  @IsBoolean()
  isActive?: boolean;
}
