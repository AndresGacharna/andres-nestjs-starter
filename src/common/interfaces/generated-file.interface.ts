/**
 * A file built by a service (an Excel export, a PDF). It knows nothing about
 * HTTP: the controller sends it with `toStreamableFile`, and another service
 * can attach the same content to an email.
 */
export interface GeneratedFile {
  fileName: string;
  mimeType: string;
  content: Buffer;
}
