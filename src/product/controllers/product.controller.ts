import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { ProductMessages } from '../constants/product.messages.js';
import { CreateProductDto } from '../dto/create-product.dto.js';
import { UpdateProductDto } from '../dto/update-product.dto.js';
import { ProductService } from '../services/product.service.js';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Consultas: sin @ResponseMessage, el resultado se devuelve tal cual.

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  // Acciones: siempre @ResponseMessage, la respuesta es { message, data? }.

  @Post()
  @ResponseMessage(ProductMessages.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Patch(':id')
  @ResponseMessage(ProductMessages.UPDATED)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(id, dto);
  }

  @Patch(':id/deactivate')
  @ResponseMessage(ProductMessages.DEACTIVATED)
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.deactivate(id);
  }

  // 200 (default de Nest) para que el mensaje llegue: un 204 no tiene body.
  @Delete(':id')
  @ResponseMessage(ProductMessages.DELETED)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }
}
