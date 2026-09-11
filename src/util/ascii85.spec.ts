import { ascii85Encode } from "./ascii85";

test("encodes complete, zero, and partial ASCII85 groups", () => {
  expect(ascii85Encode(new TextEncoder().encode("Man "))).toBe("9jqo^");
  expect(ascii85Encode(new Uint8Array([0, 0, 0, 0]))).toBe("z");
  expect(ascii85Encode(new Uint8Array([0]))).toBe("!!");
});
