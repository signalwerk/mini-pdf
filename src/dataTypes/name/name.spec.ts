import { PdfTypeEnum } from "../../dataTypes/pdf";
import { PdfTypeWriter } from "../../writer/TypeWriter";

import { pdfName, pdfNameToString } from ".";

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
