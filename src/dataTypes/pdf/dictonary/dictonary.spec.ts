import { PdfTypeEnum } from "../";
import { PdfTypeWriter } from "../../../writer/pdf/TypeWriter";

import { pdfName } from "../name";

import { pdfDictionary, PdfDictonaryToString, pdfDictionaryPair } from ".";

const value = [
  pdfDictionaryPair(pdfName("Key"), "Value"),
  pdfDictionaryPair(pdfName("B"), 2),
];
const str = "<< /Key (Value)\n/B 2 >>";

test("Generator for pdfDictionary", () => {
  expect(pdfDictionary(value)).toMatchObject({
    type: PdfTypeEnum.DICTIONARY,
    pairs: value,
  });
});

test("toString for pdfDictionary", () => {
  expect(`${PdfDictonaryToString(pdfDictionary(value))}`).toMatch(str);
});

test("PdfTypeWriter for pdfDictionary", () => {
  expect(`${PdfTypeWriter(pdfDictionary(value))}`).toMatch(str);
});
