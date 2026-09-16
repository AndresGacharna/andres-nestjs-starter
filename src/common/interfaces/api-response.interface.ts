/** Body of handlers with `@ResponseMessage()`. `data` is omitted when the handler returns nothing. */
export interface MessageResponse<T> {
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  statusCode: number;
  /** `string[]` when the error comes from `ValidationPipe`. */
  message: string | string[];
  /** Server time and route: let the client correlate a reported error with the logs. */
  timestamp: string;
  path: string;
}
