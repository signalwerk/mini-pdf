import { PdfTypeEnum, PdfTypes, PdfTypeWriter } from "../../";

// TABLE 4.1 Operator categories
export enum PdfOperatorValues {
  TEXT_FONT = "Tf",
  TEXT_POSITION = "Td",
  TEXT_PAINT = "Tj",
  TEXT_BEGIN = "BT",
  TEXT_END = "ET",
  OBJECT_REFERENCE = "R",
  TRAILER_XREF = "xref",
  TRAILER_START_XREF = "startxref",
  TRAILER_TRAILER = "trailer",
  STREAM_START = "stream",
  STREAM_END = "endstream",
  GRAPHICS_STATE_SAVE = "q",
  GRAPHICS_STATE_RESTORE = "Q",
  MATRIX_MODIFY = "cm",
  IMAGE_PAINT = "Do",
}

export type PdfOperator = {
  type: PdfTypeEnum.OPERATOR;
  stack: Array<PdfTypes>;
  operator: PdfOperatorValues;
};

export function pdfOperator(
  operator: PdfOperatorValues,
  stack?: Array<PdfTypes>
): PdfOperator {
  return {
    type: PdfTypeEnum.OPERATOR,
    stack: stack || [],
    operator,
  };
}

export function pdfOperatorToString(obj) {
  return `${[
    obj.stack.map((item) => `${PdfTypeWriter(item)}`).join(" "),
    obj.operator,
  ]
    .filter((item) => !!item)
    .join(" ")}`;
}
