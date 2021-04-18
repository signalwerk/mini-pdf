import { PdfTypeEnum, PdfTypes, PdfOperatorEnum, PdfTypeWriter } from "../../";


export type PdfOperator = {
  type: PdfTypeEnum.OPERATOR;
  stack: Array<PdfTypes>;
  operator: PdfOperatorEnum;
};

export const pdfOperator = (
  operator: PdfOperatorEnum,
  stack?: Array<PdfTypes>
): PdfOperator => ({
  type: PdfTypeEnum.OPERATOR,
  stack: stack || [],
  operator,
});

export function pdfOperatorToString(obj) {
  return `${[
    obj.stack.map((item) => `${PdfTypeWriter(item)}`).join(" "),
    obj.operator,
  ]
    .filter((item) => !!item)
    .join(" ")}`;
}
