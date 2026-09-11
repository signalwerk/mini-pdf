import { PdfType } from "../../dataTypes/pdf";
import { pdfOperator, PdfOperatorValues } from "../../dataTypes/operator";
import { RgbColor } from "../../structure";

export const StrokeLine = ({
  x1,
  y1,
  x2,
  y2,
  borderWidth = 1,
  borderColour = [0, 0, 0],
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  borderWidth?: number;
  borderColour?: RgbColor;
}): Array<PdfType> => [
  pdfOperator(PdfOperatorValues.GRAPHICS_STATE_SAVE),
  pdfOperator(PdfOperatorValues.PATH_LINE_WIDTH, [borderWidth]),
  pdfOperator(PdfOperatorValues.PATH_STROKE_COLOR_RGB, [...borderColour]),
  pdfOperator(PdfOperatorValues.PATH_MOVE, [x1, y1]),
  pdfOperator(PdfOperatorValues.PATH_LINE, [x2, y2]),
  pdfOperator(PdfOperatorValues.PATH_STROKE),
  pdfOperator(PdfOperatorValues.GRAPHICS_STATE_RESTORE),
];
