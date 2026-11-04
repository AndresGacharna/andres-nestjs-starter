/**
 * Escapes PostgreSQL LIKE / ILIKE wildcard characters in user input.
 *
 * User text is typically placed between `%...%` in ILIKE filters. Without escaping,
 * wildcards such as `%%%%%` or `_____` match any string and can bypass minimum
 * length filters to match the entire table.
 *
 * This function prefixes every `\`, `%`, and `_` with a backslash (PostgreSQL's default
 * LIKE/ILIKE escape character) so they match literally.
 *
 * @example
 * queryBuilder.andWhere('product.name ILIKE :textFilter', {
 *   textFilter: `%${escapeLike(textFilter)}%`,
 * });
 */
export function escapeLike(text: string): string {
  return text.replace(/[\\%_]/g, '\\$&');
}
