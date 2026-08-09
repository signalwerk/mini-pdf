// Minimal ambient types for the `ascii85` package (it ships no declarations).
declare module "ascii85" {
  type Ascii85 = {
    encode(data: Buffer | Uint8Array | string): Buffer;
    decode(data: Buffer | string): Buffer;
  };

  const ascii85: Ascii85;
  export default ascii85;
}
