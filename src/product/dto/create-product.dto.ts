import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { SafeText } from '../../common/decorators/safe-text.decorator.js';
import { ProductCategoryEnum } from '../enums/product-category.enum.js';

export class CreateProductDto {
  @ApiProperty({ example: 'ABC-001', maxLength: 50 })
  @SafeText(50)
  @IsNotEmpty()
  sku!: string;

  @ApiProperty({ example: 'Football, size 5, white', maxLength: 120 })
  @SafeText(120)
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    enum: ProductCategoryEnum,
    example: ProductCategoryEnum.Equipment,
  })
  @IsEnum(ProductCategoryEnum)
  category!: ProductCategoryEnum;

  // `null` is valid here: it clears the description (nullable column)
  @ApiPropertyOptional({
    example: 'Machine-stitched',
    maxLength: 500,
    nullable: true,
  })
  @IsOptional()
  @SafeText(500)
  description?: string | null;

  @ApiPropertyOptional({ maxLength: 500, nullable: true })
  @IsOptional()
  @SafeText(500)
  internalNotes?: string | null;
}
