import { ApiProperty } from '@nestjs/swagger';

import { EnumOptionDto } from '../../common/dto/enum-option.dto.js';
import { ProductCategoryEnumHelper } from '../enums/product-category.enum.js';

export class ProductParamsResponseDto {
  // The helper's own list, so the docs never drift from the API
  @ApiProperty({
    type: [EnumOptionDto],
    example: ProductCategoryEnumHelper.GetList(),
  })
  categories!: EnumOptionDto[];
}
