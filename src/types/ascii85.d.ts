// Minimal ambient types for the `ascii85` package (it ships no declarations).
declare module "ascii85" {
  export function encode(data: Buffer | Uint8Array | string): Buffer;
  export function decode(data: Buffer | string): Buffer;
}
