import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DomainException } from '../../common/exceptions/domain.exception.js';
import { ProductErrors } from '../constants/product.errors.js';
import { CreateProductDto } from '../dto/create-product.dto.js';
import { UpdateProductDto } from '../dto/update-product.dto.js';
import { Product } from '../entities/product.entity.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Consultas: devuelven el recurso tal cual, el controlador no agrega mensaje.

  findAll(): Promise<Product[]> {
    return this.productRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new DomainException(ProductErrors.NOT_FOUND);
    }
    return product;
  }

  // Acciones: devuelven la entidad (o void). El mensaje lo pone @ResponseMessage.

  async create(dto: CreateProductDto): Promise<Product> {
    await this.ensureSkuIsFree(dto.sku);
    return this.productRepository.save(this.productRepository.create(dto));
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.preload({ id, ...dto });
    if (!product) {
      throw new DomainException(ProductErrors.NOT_FOUND);
    }
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const { affected } = await this.productRepository.delete(id);
    if (!affected) {
      throw new DomainException(ProductErrors.NOT_FOUND);
    }
  }

  /** Acción que no es CRUD: mismo patrón, regla de negocio que lanza. */
  async deactivate(id: string): Promise<Product> {
    const product = await this.findOne(id);
    if (!product.isActive) {
      throw new DomainException(ProductErrors.ALREADY_INACTIVE);
    }
    product.isActive = false;
    return this.productRepository.save(product);
  }

  // El índice único ya produce un 409 genérico (UNIQUE_VIOLATION) desde el
  // filtro; validar antes le da al cliente un code propio del módulo.
  private async ensureSkuIsFree(sku: string): Promise<void> {
    const exists = await this.productRepository.existsBy({ sku });
    if (exists) {
      throw new DomainException(ProductErrors.SKU_TAKEN);
    }
  }
}
