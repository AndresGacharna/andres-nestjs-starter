import { StreamableFile } from '@nestjs/common';

import type { GeneratedFile } from '../interfaces/generated-file.interface.js';

/**
 * Sends a service's file as a download. `StreamableFile` goes through the
 * global interceptors and filter untouched, unlike `@Res()`.
 *
 * `filename` carries an ASCII fallback (quotes and non-ASCII characters
 * replaced) and `filename*` the exact name, for browsers that read it (RFC 6266).
 */
export function toStreamableFile({
  fileName,
  mimeType,
  content,
}: GeneratedFile): StreamableFile {
  const asciiFileName = fileName.replace(/[^\x20-\x7e]|"/g, '_');

  return new StreamableFile(content, {
    type: mimeType,
    disposition: `attachment; filename="${asciiFileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
  });
}
