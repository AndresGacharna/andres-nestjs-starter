import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { DomainException } from '../../common/exceptions/domain.exception.js';
import { escapeLike } from '../../common/helpers/escape-like.helper.js';
import type { PaginatedResult } from '../../common/interfaces/paginated-result.interface.js';
import { ProductExceptionResponse } from '../constants/product.exception-response.js';
import { CreateProductDto } from '../dto/create-product.dto.js';
import { ProductPagedDto } from '../dto/product-filter.dto.js';
import { ProductParamsResponseDto } from '../dto/product-params-response.dto.js';
import { UpdateProductDto } from '../dto/update-product.dto.js';
import { Product } from '../entities/product.entity.js';
import { ProductCategoryEnumHelper } from '../enums/product-category.enum.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Queries: they return the result as is, the controller adds no message.

  getParams(): ProductParamsResponseDto {
    return { categories: ProductCategoryEnumHelper.GetList() };
  }

  // No getById: a row of the list already carries everything the edit form needs.
  async getAll(pagedDto: ProductPagedDto): Promise<PaginatedResult<Product>> {
    const { page, size } = pagedDto.pagination;
    const { textFilter, category, isActive } = pagedDto.filter ?? {};

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // escapeLike: a `%` or `_` typed by the user matches literally
    if (textFilter) {
      queryBuilder.andWhere(
        '(product.name ILIKE :textFilter OR product.sku ILIKE :textFilter)',
        { textFilter: `%${escapeLike(textFilter)}%` },
      );
    }

    if (category != null) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    if (isActive != null) {
      queryBuilder.andWhere('product.isActive = :isActive', { isActive });
    }

    const [rows, count] = await queryBuilder
      .orderBy('product.name', 'ASC')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    return { page, size, count, rows };
  }

  // Actions: they return the entity (or void). @ResponseMessage adds the message.

  async create(dto: CreateProductDto): Promise<Product> {
    await this.ensureSkuIsFree(dto.sku);
    return this.productRepository.save(this.productRepository.create(dto));
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.preload({ id, ...dto });
    if (!product) {
      throw new DomainException(
        HttpStatus.NOT_FOUND,
        ProductExceptionResponse.NOT_FOUND,
      );
    }

    if (dto.sku) {
      await this.ensureSkuIsFree(dto.sku, id);
    }

    return this.productRepository.save(product);
  }

  /** An action that is not CRUD: same pattern, a business rule that throws. */
  async deactivate(id: string): Promise<Product> {
    const product = await this.getOrFail(id);
    if (!product.isActive) {
      throw new DomainException(
        HttpStatus.CONFLICT,
        ProductExceptionResponse.ALREADY_INACTIVE,
      );
    }
    product.isActive = false;
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const { affected } = await this.productRepository.delete(id);
    if (!affected) {
      throw new DomainException(
        HttpStatus.NOT_FOUND,
        ProductExceptionResponse.NOT_FOUND,
      );
    }
  }

  private async getOrFail(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new DomainException(
        HttpStatus.NOT_FOUND,
        ProductExceptionResponse.NOT_FOUND,
      );
    }
    return product;
  }

  // The unique index already yields a generic 409 (UNIQUE_VIOLATION) from the
  // filter; checking first gives the client a module-specific message.
  private async ensureSkuIsFree(
    sku: string,
    excludeId?: string,
  ): Promise<void> {
    const exists = await this.productRepository.existsBy(
      excludeId ? { sku, id: Not(excludeId) } : { sku },
    );
    if (exists) {
      throw new DomainException(
        HttpStatus.CONFLICT,
        ProductExceptionResponse.SKU_TAKEN(sku),
      );
    }
  }
}
