import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './controllers/product.controller.js';
import { Product } from './entities/product.entity.js';
import { ProductService } from './services/product.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
  // exports: [ProductService], // only if another module needs it
})
export class ProductModule {}
