import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiPagedBody } from '../../common/decorators/api-paged-body.decorator.js';
import {
  ApiErrorResponses,
  ApiMessageResponse,
  ApiPaginatedResponse,
} from '../../common/decorators/api-responses.decorator.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { ProductMessages } from '../constants/product.messages.js';
import { CreateProductDto } from '../dto/create-product.dto.js';
import { ProductPagedDto } from '../dto/product-filter.dto.js';
import { ProductParamsResponseDto } from '../dto/product-params-response.dto.js';
import { UpdateProductDto } from '../dto/update-product.dto.js';
import { Product } from '../entities/product.entity.js';
import { ProductCategoryEnum } from '../enums/product-category.enum.js';
import { ProductService } from '../services/product.service.js';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Queries: no @ResponseMessage, the result is returned as is.

  @Get('getParams')
  @ApiOperation({ summary: 'Get the lists the product forms need' })
  @ApiOkResponse({ type: ProductParamsResponseDto })
  getParams() {
    return this.productService.getParams();
  }

  // Query over POST (filters in the body): 200 instead of the default 201
  @Post('getAll')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all products, paginated and filtered',
    description:
      '`textFilter` is a partial match on the name or the SKU. Sorted by name.',
  })
  @ApiPagedBody(ProductPagedDto, {
    allFilters: {
      summary: 'Every filter (remove the ones you do not need)',
      filter: {
        textFilter: 'Football',
        category: ProductCategoryEnum.Equipment,
        isActive: true,
      },
    },
    bySku: { summary: 'By SKU', filter: { textFilter: 'ABC-001' } },
    activeOnly: { summary: 'Active only', filter: { isActive: true } },
  })
  @ApiPaginatedResponse(Product)
  @ApiErrorResponses(HttpStatus.BAD_REQUEST)
  getAll(@Body() pagedDto: ProductPagedDto) {
    return this.productService.getAll(pagedDto);
  }

  // Actions: always @ResponseMessage, the response is { message, data? }.

  @Post('create')
  @ResponseMessage(ProductMessages.CREATED)
  @ApiOperation({
    summary: 'Create a product',
    description: '`sku` is unique.',
  })
  @ApiMessageResponse(HttpStatus.CREATED, Product)
  @ApiErrorResponses(HttpStatus.BAD_REQUEST, HttpStatus.CONFLICT)
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Put('update/:id')
  @ResponseMessage(ProductMessages.UPDATED)
  @ApiOperation({ summary: 'Update a product' })
  @ApiMessageResponse(HttpStatus.OK, Product)
  @ApiErrorResponses(
    HttpStatus.BAD_REQUEST,
    HttpStatus.NOT_FOUND,
    HttpStatus.CONFLICT,
  )
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(id, dto);
  }

  @Put('deactivate/:id')
  @ResponseMessage(ProductMessages.DEACTIVATED)
  @ApiOperation({ summary: 'Deactivate a product' })
  @ApiMessageResponse(HttpStatus.OK, Product)
  @ApiErrorResponses(HttpStatus.NOT_FOUND, HttpStatus.CONFLICT)
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.deactivate(id);
  }

  // 200 (the default) so the message gets through: a 204 has no body.
  @Delete('delete/:id')
  @ResponseMessage(ProductMessages.DELETED)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiMessageResponse(HttpStatus.OK)
  @ApiErrorResponses(HttpStatus.NOT_FOUND, HttpStatus.CONFLICT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }
}
