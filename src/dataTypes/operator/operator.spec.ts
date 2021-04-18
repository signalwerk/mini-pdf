import { PdfTypeWriter, PdfTypeEnum, PdfOperatorEnum } from "../../";

import { pdfOperator, pdfOperatorToString } from ".";

const value = [42, "10"];
const str = "42 (10) Tf";

test("Generator for pdfOperator", () => {
  expect(pdfOperator(PdfOperatorEnum.TEXT_FONT, value)).toMatchObject({
    type: PdfTypeEnum.OPERATOR,
    stack: value,
    operator: PdfOperatorEnum.TEXT_FONT,
  });
});

test("toString for pdfOperator", () => {
  expect(
    `${pdfOperatorToString(pdfOperator(PdfOperatorEnum.TEXT_FONT, value))}`
  ).toMatch(str);
});

test("PdfTypeWriter for pdfOperator", () => {
  expect(
    `${PdfTypeWriter(pdfOperator(PdfOperatorEnum.TEXT_FONT, value))}`
  ).toMatch(str);
});
