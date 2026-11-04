import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity as a select option for other modules' forms: `{ id, name }`. Shared by
 * every list, so each response DTO sets its own `example` on the list.
 */
export class OptionDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Option name' })
  name!: string;
}
