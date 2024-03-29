import { pdfName } from "../../dataTypes/name";
import { PdfType } from "../../dataTypes/pdf";
import { pdfOperator, PdfOperatorValues } from "../../dataTypes/operator";

export const TextLine = ({
  x,
  y,
  size,
  font,
  content,
}: {
  x: number;
  y: number;
  size: number;
  font: string;
  content: string;
}): Array<PdfType> => {
  return [
    pdfOperator(PdfOperatorValues.TEXT_BEGIN),
    pdfOperator(PdfOperatorValues.TEXT_FONT, [pdfName(font), size]),
    pdfOperator(PdfOperatorValues.TEXT_POSITION, [x, y]),
    pdfOperator(PdfOperatorValues.TEXT_PAINT, [content]),
    pdfOperator(PdfOperatorValues.TEXT_END),
  ];
};
