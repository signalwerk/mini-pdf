import { PdfTypeWriter, PdfTypeEnum } from "../index";

import { pdfArray, pdfArrayToString } from ".";

test("Generator for PdfArray", () => {
  const value = ["Hello World.", 3, 0];
  expect(pdfArray(value)).toMatchObject({
    type: PdfTypeEnum.ARRAY,
    value,
  });
});

test("toString for PdfArray", () => {
  expect(`${pdfArrayToString(pdfArray(["Hello World.", 3, 0]))}`).toMatch(
    "[(Hello World.) 3 0]"
  );
});

test("PdfTypeWriter for PdfArray", () => {
  expect(`${PdfTypeWriter(pdfArray(["Hello World.", 3, 0]))}`).toMatch(
    `${pdfArrayToString(pdfArray(["Hello World.", 3, 0]))}`
  );
});
