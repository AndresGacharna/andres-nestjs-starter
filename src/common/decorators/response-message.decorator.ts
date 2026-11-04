import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'responseMessage';

/**
 * Marks a handler as an action whose success message the client shows.
 * The response becomes `{ message, data? }`; without this decorator the
 * handler result is returned as-is. Keep the text in
 * `<feature>/constants/<feature>.messages.ts`.
 *
 * @example
 * @Post('create')
 * @ResponseMessage(CompanyMessages.CREATED)
 * create(@Body() dto: CreateCompanyDto) { ... }
 */
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_KEY, message);
