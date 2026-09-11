import { PdfOperatorValues } from "../../dataTypes/operator";
import { StrokeLine } from ".";

test("generates a stroked PDF line", () => {
  expect(
    StrokeLine({
      x1: 10,
      y1: 20,
      x2: 30,
      y2: 40,
      borderWidth: 0.5,
      borderColour: [1, 0, 1],
    }),
  ).toEqual([
    expect.objectContaining({ operator: PdfOperatorValues.GRAPHICS_STATE_SAVE }),
    expect.objectContaining({ operator: PdfOperatorValues.PATH_LINE_WIDTH, stack: [0.5] }),
    expect.objectContaining({
      operator: PdfOperatorValues.PATH_STROKE_COLOR_RGB,
      stack: [1, 0, 1],
    }),
    expect.objectContaining({ operator: PdfOperatorValues.PATH_MOVE, stack: [10, 20] }),
    expect.objectContaining({ operator: PdfOperatorValues.PATH_LINE, stack: [30, 40] }),
    expect.objectContaining({ operator: PdfOperatorValues.PATH_STROKE }),
    expect.objectContaining({ operator: PdfOperatorValues.GRAPHICS_STATE_RESTORE }),
  ]);
});
