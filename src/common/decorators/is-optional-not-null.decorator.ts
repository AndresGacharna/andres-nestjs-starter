import { ValidateIf } from 'class-validator';

/**
 * Like `@IsOptional()`, but only an omitted field (`undefined`) skips validation.
 * A `null` is validated like any other value, so it fails the field's validators
 * (400) instead of reaching a NOT NULL column (500).
 *
 * Use it on optional fields that are written to a NOT NULL column (`isActive`).
 * Keep `@IsOptional()` where `null` is a valid value (`approverId: null` removes
 * the approver) and on filters, where `null` means "not sent".
 *
 * @example
 * @ApiPropertyOptional({ example: false })
 * @IsOptionalNotNull()
 * @IsBoolean()
 * isActive?: boolean;
 */
export function IsOptionalNotNull(): PropertyDecorator {
  return ValidateIf((_object: object, value: unknown) => value !== undefined);
}
