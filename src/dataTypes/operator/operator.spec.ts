import { PdfTypeWriter, PdfTypeEnum } from "../../";

import { pdfOperator, pdfOperatorToString, PdfOperatorValues } from ".";

const value = [42, "10"];
const str = "42 (10) Tf";

test("Generator for pdfOperator", () => {
  expect(pdfOperator(PdfOperatorValues.TEXT_FONT, value)).toMatchObject({
    type: PdfTypeEnum.OPERATOR,
    stack: value,
    operator: PdfOperatorValues.TEXT_FONT,
  });
});

test("toString for pdfOperator", () => {
  expect(
    `${pdfOperatorToString(pdfOperator(PdfOperatorValues.TEXT_FONT, value))}`
  ).toMatch(str);
});

test("PdfTypeWriter for pdfOperator", () => {
  expect(
    `${PdfTypeWriter(pdfOperator(PdfOperatorValues.TEXT_FONT, value))}`
  ).toMatch(str);
});
