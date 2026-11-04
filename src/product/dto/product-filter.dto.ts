import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, ValidateNested } from 'class-validator';

import { BaseFilterDto } from '../../common/dto/base-filter.dto.js';
import { PagedDto } from '../../common/dto/paged.dto.js';
import { ProductCategoryEnum } from '../enums/product-category.enum.js';

// `textFilter` (with @SafeText) comes from BaseFilterDto: do not redeclare it
export class ProductFilterDto extends BaseFilterDto {
  @ApiPropertyOptional({ enum: ProductCategoryEnum })
  @IsOptional()
  @IsEnum(ProductCategoryEnum)
  category?: ProductCategoryEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ProductPagedDto extends PagedDto<ProductFilterDto> {
  @ApiPropertyOptional({ type: ProductFilterDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductFilterDto)
  declare filter?: ProductFilterDto;
}
