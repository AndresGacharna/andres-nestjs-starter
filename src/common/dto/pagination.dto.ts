import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

// `null` means "not sent": fall back to the default. Invalid values still fail validation.
export class PaginationDto {
  @ApiPropertyOptional({ default: DEFAULT_PAGE, minimum: 1 })
  @Transform(({ value }) => value ?? DEFAULT_PAGE)
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    default: DEFAULT_PAGE_SIZE,
    minimum: 1,
    maximum: MAX_PAGE_SIZE,
  })
  @Transform(({ value }) => value ?? DEFAULT_PAGE_SIZE)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  size: number = DEFAULT_PAGE_SIZE;
}
