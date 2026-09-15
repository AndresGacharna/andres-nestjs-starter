// https://www.postgresql.org/docs/current/errcodes-appendix.html
export const PostgresErrorCode = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
} as const;
