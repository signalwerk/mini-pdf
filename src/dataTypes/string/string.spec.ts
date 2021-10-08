import { PdfTypeEnum } from "../../dataTypes/pdf";
import { PdfTypeWriter } from "../../writer/TypeWriter";

import { pdfString, pdfStringToString } from ".";

const value = "Hello World.";
const str = "(Hello World.)";

test("Generator for pdfString", () => {
  expect(pdfString(value)).toMatchObject({
    type: PdfTypeEnum.STRING,
    value,
  });
});

test("toString for pdfString", () => {
  expect(`${pdfStringToString(pdfString(value))}`).toMatch(str);
});

test("PdfTypeWriter for pdfString", () => {
  expect(`${PdfTypeWriter(pdfString(value))}`).toMatch(str);
});
