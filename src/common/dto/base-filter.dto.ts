import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { SafeText } from '../decorators/safe-text.decorator.js';

export class BaseFilterDto {
  @ApiPropertyOptional({ description: 'Free text search', maxLength: 100 })
  @IsOptional()
  @SafeText(100)
  textFilter?: string;
}
