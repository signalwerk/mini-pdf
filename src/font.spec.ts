import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { unicodeCodePointsToUtf16Hex } from "./font";
import { AstTypesEnum, Document, OpenTypeFeatures } from "./structure";
import { Writer } from "./writer/index";

const here = path.dirname(fileURLToPath(import.meta.url));
const fontBase64 = fs
  .readFileSync(
    path.join(here, "testAssets/NotoSans-Test.ttf.base64"),
    "utf8",
  )
  .replace(/\s+/g, "");
const fontData = Buffer.from(fontBase64, "base64");

const documentWithText = (
  content: string,
  features?: OpenTypeFeatures,
): Document => ({
  type: AstTypesEnum.DOCUMENT,
  fonts: [
    {
      type: AstTypesEnum.FONT,
      id: "FTest",
      data: fontData,
    },
  ],
  children: [
    {
      type: AstTypesEnum.VIEWPORT,
      attributes: { mediaBox: [0, 0, 400, 200] },
      children: [
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 100,
            size: 100,
            font: "FTest",
            content,
            features,
          },
        },
      ],
    },
  ],
});

const textBlock = (pdf: string): string => {
  const match = pdf.match(/\nBT\n([\s\S]*?)\nET\n/);

  if (!match) throw new Error("PDF has no text object.");
  return match[1];
};

const glyphPositions = (pdf: string): Array<number> =>
  Array.from(
    textBlock(pdf).matchAll(
      /^1 0 0 1 (-?(?:\d+(?:\.\d+)?)) -?(?:\d+(?:\.\d+)?) Tm$/gm,
    ),
    (match) => Number(match[1]),
  );

const glyphPaintCount = (pdf: string): number =>
  Array.from(textBlock(pdf).matchAll(/^<[0-9A-F]{4}> Tj$/gm)).length;

test("ToUnicode encodes supplementary characters and ligature sequences", () => {
  expect(unicodeCodePointsToUtf16Hex([0x1f600])).toBe("D83DDE00");
  expect(unicodeCodePointsToUtf16Hex([0x66, 0x69])).toBe("00660069");
  expect(unicodeCodePointsToUtf16Hex([0xd800])).toBe("FFFD");
});

test("Writer embeds a subset TrueType font as a Unicode Type0 font", () => {
  const pdf = Writer(documentWithText("AV fi café"));

  expect(pdf).toContain("/Subtype /Type0");
  expect(pdf).toContain("/Encoding /Identity-H");
  expect(pdf).toContain("/DescendantFonts");
  expect(pdf).toContain("/Subtype /CIDFontType2");
  expect(pdf).toContain("/FontDescriptor");
  expect(pdf).toContain("/FontFile2");
  expect(pdf).toContain("/CIDToGIDMap /Identity");
  expect(pdf).toContain("/ToUnicode");
  expect(pdf).toContain("/Filter /ASCII85Decode");
  expect(pdf).toMatch(/\/BaseFont \/[A-Z]{6}\+NotoSans-Regular/);
});

test("kerning changes the second glyph's text matrix position", () => {
  const defaultPositions = glyphPositions(Writer(documentWithText("AV")));
  const kerned = glyphPositions(
    Writer(documentWithText("AV", { kern: true })),
  );
  const unkerned = glyphPositions(
    Writer(documentWithText("AV", { kern: false })),
  );

  expect(kerned).toHaveLength(2);
  expect(unkerned).toHaveLength(2);
  expect(kerned[0]).toBe(unkerned[0]);
  expect(kerned[1]).toBeLessThan(unkerned[1]);
  expect(defaultPositions).toEqual(kerned);
});

test("standard ligatures emit fewer glyphs and preserve their Unicode text", () => {
  const defaultLigature = Writer(documentWithText("fi"));
  const withLigature = Writer(
    documentWithText("fi", { liga: true }),
  );
  const withoutLigature = Writer(
    documentWithText("fi", { liga: false }),
  );

  expect(glyphPaintCount(withLigature)).toBeLessThan(
    glyphPaintCount(withoutLigature),
  );
  expect(glyphPaintCount(withLigature)).toBe(1);
  expect(glyphPaintCount(withoutLigature)).toBe(2);
  expect(withLigature).toMatch(/<[0-9A-F]{4}> <00660069>/);
  expect(glyphPaintCount(defaultLigature)).toBe(1);
  expect(defaultLigature).toMatch(/<[0-9A-F]{4}> <00660069>/);
});

test("shaping does not mutate feature overrides in the input AST", () => {
  const features = { kern: false, liga: false };

  Writer(documentWithText("AV fi", features));

  expect(features).toEqual({ kern: false, liga: false });
});

test("ToUnicode maps non-ASCII text independently of subset glyph ids", () => {
  const pdf = Writer(documentWithText("café"));

  expect(pdf).toMatch(/<[0-9A-F]{4}> <00E9>/);
});
