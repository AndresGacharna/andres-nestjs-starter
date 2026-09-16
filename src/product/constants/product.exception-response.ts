export const ProductExceptionResponse = {
  NOT_FOUND: 'Product not found',
  SKU_TAKEN: 'A product with this SKU already exists',
  ALREADY_INACTIVE: 'The product is already inactive',
} as const;
