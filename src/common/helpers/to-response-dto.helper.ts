import { plainToInstance, type ClassConstructor } from 'class-transformer';

/**
 * Builds a response DTO from an entity (or a list of them): only the DTO's
 * `@Expose()` fields go out, read from the entity by name (getters included)
 * or computed by a `@Transform(..., { toClassOnly: true })`.
 *
 * Pass the entity itself, never a spread (`{ ...entity }`): a spread drops
 * the entity's getters.
 */
export function toResponseDto<T, V extends object>(
  dto: ClassConstructor<T>,
  source: V[],
): T[];
export function toResponseDto<T, V extends object>(
  dto: ClassConstructor<T>,
  source: V,
): T;
export function toResponseDto<T, V extends object>(
  dto: ClassConstructor<T>,
  source: V | V[],
): T | T[] {
  return plainToInstance(dto, source, { excludeExtraneousValues: true });
}
