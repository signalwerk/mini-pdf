import { PdfOperatorValues } from "../../dataTypes/operator";
import { StrokeBox } from ".";

test("generates a stroked PDF box", () => {
  expect(StrokeBox({ x: 10, y: 20, width: 30, height: 40 })).toEqual([
    expect.objectContaining({ operator: PdfOperatorValues.GRAPHICS_STATE_SAVE }),
    expect.objectContaining({ operator: PdfOperatorValues.PATH_LINE_WIDTH, stack: [1] }),
    expect.objectContaining({
      operator: PdfOperatorValues.PATH_STROKE_COLOR_RGB,
      stack: [0, 0, 0],
    }),
    expect.objectContaining({
      operator: PdfOperatorValues.PATH_RECTANGLE,
      stack: [10, 20, 30, 40],
    }),
    expect.objectContaining({ operator: PdfOperatorValues.PATH_STROKE }),
    expect.objectContaining({ operator: PdfOperatorValues.GRAPHICS_STATE_RESTORE }),
  ]);
});
