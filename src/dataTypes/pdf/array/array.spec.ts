import { PdfTypeEnum } from "../";
import { PdfTypeWriter } from "../../../writer/TypeWriter";

import { pdfArray, pdfArrayToString } from ".";

const value = ["Hello World.", 3, 0];
const str = "[(Hello World.) 3 0]";

test("Generator for PdfArray", () => {
  const value = ["Hello World.", 3, 0];
  expect(pdfArray(value)).toMatchObject({
    type: PdfTypeEnum.ARRAY,
    value,
  });
});

test("toString for PdfArray", () => {
  expect(`${pdfArrayToString(pdfArray(value))}`).toMatch(str);
});

test("PdfTypeWriter for PdfArray", () => {
  expect(`${PdfTypeWriter(pdfArray(value))}`).toMatch(str);
});
