import type { Type } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../dto/pagination.dto.js';

/** One body example of a paginated query: what it shows and its filter. */
export interface PagedBodyExample<TFilter> {
  summary: string;
  filter: TFilter;
}

/**
 * Documents the `{ pagination, filter }` body of a paginated query with
 * examples; each one gets the default pagination. `allFilters` is required and
 * always goes first: it is the example Swagger's "Try it out" loads, so every
 * filter shows up ready to edit. The filters are typed against the paged DTO,
 * so a misspelled field does not compile.
 *
 * @example
 * @ApiPagedBody(ProductPagedDto, {
 *   allFilters: { summary: 'Every filter', filter: { textFilter: 'Ball' } },
 *   bySku: { summary: 'By SKU', filter: { textFilter: 'ABC-001' } },
 * })
 */
export function ApiPagedBody<TFilter>(
  type: Type<{ filter?: TFilter }>,
  {
    allFilters,
    ...examples
  }: { allFilters: PagedBodyExample<TFilter> } & Record<
    string,
    PagedBodyExample<TFilter>
  >,
) {
  const pagination = { page: DEFAULT_PAGE, size: DEFAULT_PAGE_SIZE };

  return ApiBody({
    type,
    examples: Object.fromEntries(
      Object.entries({ allFilters, ...examples }).map(
        ([name, { summary, filter }]) => [
          name,
          { summary, value: { pagination, filter } },
        ],
      ),
    ),
  });
}
