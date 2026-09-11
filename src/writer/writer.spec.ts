import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { printDebug, Writer, xrefWriter } from "./index";
import { AstTypesEnum, Document } from "../structure";

const here = path.dirname(fileURLToPath(import.meta.url));
const imageData = fs.readFileSync(
  path.join(here, "../../examples/assets/sample.jpg"),
);

// An AST that exercises every node type.
const document: Document = {
  type: AstTypesEnum.DOCUMENT,
  info: { title: "mini-pdf", author: "tester", creator: "mini-pdf" },
  fonts: [{ type: AstTypesEnum.FONT, id: "F1" }],
  children: [
    {
      type: AstTypesEnum.VIEWPORT,
      attributes: { mediaBox: [0, 0, 300, 200] },
      children: [
        {
          type: AstTypesEnum.LINE,
          attributes: {
            x1: 10,
            y1: 20,
            x2: 30,
            y2: 40,
            borderWidth: 0.5,
            borderColour: [1, 0, 1],
          },
        },
        {
          type: AstTypesEnum.BOX,
          attributes: { x: 50, y: 60, width: 70, height: 80 },
        },
        {
          type: AstTypesEnum.IMAGE,
          attributes: {
            x: 20,
            y: 40,
            width: 120,
            height: 120,
            data: imageData,
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 24,
            size: 24,
            font: "F1",
            content: "mini-pdf",
          },
        },
        {
          type: AstTypesEnum.TEXTBOX,
          attributes: {
            x: 20,
            y: 50,
            width: 40,
            height: 24,
            lineHeight: 8,
            size: 8,
            font: "F1",
            content: "one two three four",
          },
        },
      ],
    },
  ],
};

test("Writer renders an AST containing every element type", () => {
  const pdf = Writer(document);

  // structural envelope
  expect(pdf.startsWith("%PDF-1.3")).toBe(true);
  expect(pdf.trimEnd().endsWith("%%EOF")).toBe(true);

  // the document skeleton
  expect(pdf).toContain("/Type /Catalog");
  expect(pdf).toContain("/Type /Pages");
  expect(pdf).toContain("/Type /Page");
  expect(pdf).toContain("/BaseFont /Helvetica");

  // the text node
  expect(pdf).toContain("(mini-pdf) Tj");
  expect(pdf).toContain("(one two) Tj");
  expect(pdf).toContain("(three) Tj");
  expect(pdf).toContain("(four) Tj");

  // top-left line/box coordinates converted to PDF page coordinates
  expect(pdf).toContain("0.5 w\n1 0 1 RG\n10 180 m\n30 160 l\nS");
  expect(pdf).toContain("1 w\n0 0 0 RG\n50 60 70 80 re\nS");

  // the image node: a DCTDecode XObject painted via a uniquely named resource
  expect(pdf).toContain("/Subtype /Image");
  expect(pdf).toContain("/DCTDecode");
  expect(pdf).toMatch(/\/Im\d+ Do/);

  // document info: an /Info dictionary referenced from the trailer
  expect(pdf).toContain("/Title (mini-pdf)");
  expect(pdf).toMatch(/\/Info \d+ 0 R/);
});

test("Writer xref and startxref offsets address UTF-8 byte positions", () => {
  const pdf = Writer(document);
  const xrefCharacterOffset = pdf.indexOf("xref\n");
  const xrefByteOffset = Buffer.byteLength(
    pdf.slice(0, xrefCharacterOffset),
    "utf8",
  );
  const startxref = pdf.match(/startxref\n(\d+)\n%%EOF$/);

  expect(startxref).not.toBeNull();
  expect(Number(startxref[1])).toBe(xrefByteOffset);

  const xrefLines = pdf.slice(xrefCharacterOffset).split("\n");
  const objectCount = Number(xrefLines[1].split(" ")[1]) - 1;

  for (let id = 1; id <= objectCount; id += 1) {
    const marker = `${id} 0 obj\n`;
    const objectCharacterOffset = pdf.indexOf(marker);
    const objectByteOffset = Buffer.byteLength(
      pdf.slice(0, objectCharacterOffset),
      "utf8",
    );
    const declaredOffset = Number(xrefLines[id + 2].slice(0, 10));

    expect(objectCharacterOffset).toBeGreaterThanOrEqual(0);
    expect(declaredOffset).toBe(objectByteOffset);
  }
});

test("xref entries use the fixed-width PDF format", () => {
  expect(xrefWriter(123, 0, true)).toBe("0000000123 00000 n");
  expect(xrefWriter(0, 65535, false)).toBe("0000000000 65535 f");
});

test("printDebug annotates UTF-8 byte offsets", () => {
  expect(printDebug("A\né\n🙂")).toBe(
    ["0000000000   A", "0000000002   é", "0000000005   🙂"].join("\n"),
  );
});
