import { cidHex, ShapedGlyph } from "../../font";
import { PlainContent } from "../PlainContent";
import { PdfType } from "../../dataTypes/pdf";
import { pdfName } from "../../dataTypes/name";
import { pdfOperator, PdfOperatorValues } from "../../dataTypes/operator";

const round = (value: number): number =>
  Math.round((value + Number.EPSILON) * 1_000_000) / 1_000_000;

/**
 * Paint a shaped run one glyph at a time at absolute positions. This is more
 * verbose than a TJ array, but directly supports all x/y advances and offsets
 * returned by the OpenType shaper (including kerning and mark positioning).
 */
export const ShapedTextLine = ({
  x,
  y,
  size,
  font,
  unitsPerEm,
  glyphs,
}: {
  x: number;
  y: number;
  size: number;
  font: string;
  unitsPerEm: number;
  glyphs: Array<ShapedGlyph>;
}): Array<PdfType> => {
  const values: Array<PdfType> = [
    pdfOperator(PdfOperatorValues.TEXT_BEGIN),
    pdfOperator(PdfOperatorValues.TEXT_FONT, [pdfName(font), size]),
  ];
  const scale = size / unitsPerEm;
  let penX = 0;
  let penY = 0;

  glyphs.forEach((glyph) => {
    values.push(
      pdfOperator(PdfOperatorValues.TEXT_MATRIX, [
        1,
        0,
        0,
        1,
        round(x + (penX + glyph.xOffset) * scale),
        round(y + (penY + glyph.yOffset) * scale),
      ]),
      pdfOperator(PdfOperatorValues.TEXT_PAINT, [
        PlainContent(cidHex(glyph.cid)),
      ]),
    );

    penX += glyph.xAdvance;
    penY += glyph.yAdvance;
  });

  values.push(pdfOperator(PdfOperatorValues.TEXT_END));
  return values;
};
