import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import {
  ProductCategoryEnum,
  ProductCategoryEnumHelper,
} from '../enums/product-category.enum.js';

@Entity('product')
export class Product {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'ABC-001' })
  @Column({ type: 'varchar', unique: true })
  sku!: string;

  @ApiProperty({ example: 'Football, size 5, white' })
  @Column({ type: 'varchar' })
  name!: string;

  @ApiProperty({
    enum: ProductCategoryEnum,
    description: ProductCategoryEnumHelper.GetList()
      .map(({ id, value }) => `${id}: ${value}`)
      .join(', '),
  })
  @Column({ type: 'int' })
  category!: ProductCategoryEnum;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'varchar', nullable: true })
  description!: string | null;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  // Sensitive field: the global ClassSerializerInterceptor strips it from every
  // response, queries and actions alike. No @ApiProperty: it never goes out.
  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  internalNotes!: string | null;
}
