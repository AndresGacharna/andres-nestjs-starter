import { HttpStatus } from '@nestjs/common';

import type { ErrorDefinition } from '../../common/interfaces/error-definition.interface.js';

export const ProductErrors = {
  NOT_FOUND: {
    code: 'PRODUCT_NOT_FOUND',
    message: 'Product not found',
    status: HttpStatus.NOT_FOUND,
  },
  SKU_TAKEN: {
    code: 'PRODUCT_SKU_TAKEN',
    message: 'A product with this SKU already exists',
    status: HttpStatus.CONFLICT,
  },
  ALREADY_INACTIVE: {
    code: 'PRODUCT_ALREADY_INACTIVE',
    message: 'The product is already inactive',
    status: HttpStatus.CONFLICT,
  },
} as const satisfies Record<string, ErrorDefinition>;
