const CONTROL_CHARACTERS_REGEX =
  // oxlint-disable-next-line no-control-regex -- control characters must be stripped except \t, \n, \r
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
const ZERO_WIDTH_CHARACTERS_REGEX = /[\u200B\u2060\uFEFF]/g;
const BIDI_CONTROL_CHARACTERS_REGEX = /[\u202A-\u202E\u2066-\u2069]/g;

/**
 * Normalizes text to NFC, removes C0/C1 control characters (except `\t`, `\n`, `\r`),
 * zero-width characters, and bidi control characters, and trims whitespace.
 * Provides the same cleaning as `@SafeText` for text that does not come through a DTO (e.g. Excel cells).
 */
export function sanitizeText(value: string): string {
  return value
    .normalize('NFC')
    .replace(CONTROL_CHARACTERS_REGEX, '')
    .replace(ZERO_WIDTH_CHARACTERS_REGEX, '')
    .replace(BIDI_CONTROL_CHARACTERS_REGEX, '')
    .trim();
}

/**
 * Returns true when the text contains `<` or `>`.
 * Plain-text fields reject markup instead of stripping it.
 */
export function containsMarkup(value: string): boolean {
  return /[<>]/.test(value);
}
