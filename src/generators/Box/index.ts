import { PdfType } from "../../dataTypes/pdf";
import { pdfOperator, PdfOperatorValues } from "../../dataTypes/operator";
import { RgbColor } from "../../structure";

export const StrokeBox = ({
  x,
  y,
  width,
  height,
  borderWidth = 1,
  borderColour = [0, 0, 0],
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  borderWidth?: number;
  borderColour?: RgbColor;
}): Array<PdfType> => [
  pdfOperator(PdfOperatorValues.GRAPHICS_STATE_SAVE),
  pdfOperator(PdfOperatorValues.PATH_LINE_WIDTH, [borderWidth]),
  pdfOperator(PdfOperatorValues.PATH_STROKE_COLOR_RGB, [...borderColour]),
  pdfOperator(PdfOperatorValues.PATH_RECTANGLE, [x, y, width, height]),
  pdfOperator(PdfOperatorValues.PATH_STROKE),
  pdfOperator(PdfOperatorValues.GRAPHICS_STATE_RESTORE),
];
