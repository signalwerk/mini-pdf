import { pdfName } from "../name";

import { pdfDictionaryPair, pdfDictionaryPairToString } from ".";

const value = { key: pdfName("key"), value: "Hello" };
const str = "/key (Hello)";

test("Generator for pdfDictionaryPair", () => {
  expect(pdfDictionaryPair(value.key, value.value)).toMatchObject({
    key: value.key,
    value: value.value,
  });
});

test("toString for pdfDictionaryPair", () => {
  expect(
    `${pdfDictionaryPairToString(pdfDictionaryPair(value.key, value.value))}`
  ).toMatch(str);
});
