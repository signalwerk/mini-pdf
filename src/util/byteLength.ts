const utf8Encoder = new TextEncoder();

/** Number of bytes emitted when a JavaScript string is encoded as UTF-8. */
export const byteLength = (value: string): number =>
  utf8Encoder.encode(value).byteLength;
