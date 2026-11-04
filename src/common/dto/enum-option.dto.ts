import { ApiProperty } from '@nestjs/swagger';

/**
 * Item returned by the `Get<Enum>List()` helpers: `{ id, value }`. Shared by
 * every enum, so each response DTO sets the helper's list as its `example`.
 */
export class EnumOptionDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Option text' })
  value!: string;
}
