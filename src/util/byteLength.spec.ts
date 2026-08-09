import { byteLength } from "./byteLength";

test("byteLength counts UTF-8 bytes", () => {
  expect(byteLength("ASCII")).toBe(5);
  expect(byteLength("é")).toBe(2);
  expect(byteLength("🙂")).toBe(4);
});
