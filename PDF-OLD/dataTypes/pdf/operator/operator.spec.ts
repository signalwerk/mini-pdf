import { PdfTypeEnum } from "../";
import { PdfTypeWriter } from "../../../writer/pdf/TypeWriter";

import { pdfOperator, pdfOperatorToString, PdfOperatorValues } from ".";

const value = { operator: PdfOperatorValues.TEXT_FONT, stack: [42, "10"] };
const str = "42 (10) Tf";

test("Generator for pdfOperator", () => {
  expect(pdfOperator(value.operator, value.stack)).toMatchObject({
    type: PdfTypeEnum.OPERATOR,
    stack: value.stack,
    operator: value.operator,
  });
});

test("toString for pdfOperator", () => {
  expect(
    `${pdfOperatorToString(pdfOperator(value.operator, value.stack))}`
  ).toMatch(str);
});

test("PdfTypeWriter for pdfOperator", () => {
  expect(`${PdfTypeWriter(pdfOperator(value.operator, value.stack))}`).toMatch(
    str
  );
});
