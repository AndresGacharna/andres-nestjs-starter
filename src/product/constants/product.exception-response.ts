export const ProductExceptionResponse = {
  NOT_FOUND: 'Product not found',
  // Dynamic texts are functions in the catalog too, never inline in the service
  SKU_TAKEN: (sku: string) => `A product with SKU ${sku} already exists`,
  ALREADY_INACTIVE: 'The product is already inactive',
} as const;
