import { PdfTypeWriter, PdfTypeEnum } from "../index";

import { pdfName, pdfNameToString } from "../name";

const value = "Hello";
const str = "/Hello";

test("Generator for pdfName", () => {
  expect(pdfName(value)).toMatchObject({
    type: PdfTypeEnum.NAME,
    value,
  });
});

test("toString for pdfName", () => {
  expect(`${pdfNameToString(pdfName(value))}`).toMatch(str);
});

test("PdfTypeWriter for pdfName", () => {
  expect(`${PdfTypeWriter(pdfName(value))}`).toMatch(str);
});