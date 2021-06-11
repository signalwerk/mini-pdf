import { TextLine } from "../TextLine";
import { pdfOperator, PdfOperatorValues } from "../../dataTypes/operator";
import { pdfName } from "../../dataTypes/name";

test("Generator for TextLine", () => {
  const textLine = TextLine({
    x: 60,
    y: 50,
    size: 18,
    font: "F1",
    content: "hello world",
  });

  expect(textLine).toMatchObject([
    pdfOperator(PdfOperatorValues.TEXT_BEGIN),
    pdfOperator(PdfOperatorValues.TEXT_FONT, [pdfName("F1"), 18]),
    pdfOperator(PdfOperatorValues.TEXT_POSITION, [60, 50]),
    pdfOperator(PdfOperatorValues.TEXT_PAINT, ["hello world"]),
    pdfOperator(PdfOperatorValues.TEXT_END),
  ]);
});
