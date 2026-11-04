/** Result of a paginated query. Documented in Swagger with `@ApiPaginatedResponse()`. */
export interface PaginatedResult<T> {
  page: number;
  size: number;
  count: number;
  rows: T[];
}
