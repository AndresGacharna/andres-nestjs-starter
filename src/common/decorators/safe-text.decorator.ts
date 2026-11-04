import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength } from 'class-validator';

import { sanitizeText } from '../helpers/sanitize-text.helper.js';

/**
 * Sanitizes and validates free-text input fields.
 *
 * Normalizes to NFC, removes C0/C1 control characters (except `\t`, `\n`, `\r`), zero-width
 * characters, and bidi controls (ZWJ/ZWNJ are kept), then trims, via `sanitizeText`.
 * Validates string and max length, and rejects `<` or `>` with HTTP 400 on purpose
 * instead of stripping (see `.claude/skills/andres-nestjs-architecture/SKILL.md`
 * section Input sanitization: Free text).
 *
 * Replaces the `@Transform(trim)` + `@IsString()` + `@MaxLength()` trio, while
 * `@IsOptional()`, `@IsNotEmpty()`, `@MinLength()`, and `@ApiProperty()` stay on the field.
 * Do not apply to emails, passwords, UUIDs, enums, numbers, or dates.
 *
 * @example
 * @ApiProperty({ example: 'Example Company Inc.', maxLength: 150 })
 * @SafeText(150)
 * @IsNotEmpty()
 * name!: string;
 */
export function SafeText(maxLength: number): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }: { value: unknown }) => {
      if (typeof value !== 'string') {
        return value;
      }

      return sanitizeText(value);
    }),
    IsString(),
    MaxLength(maxLength),
    Matches(/^[^<>]*$/, { message: '$property must not contain < or >' }),
  );
}
