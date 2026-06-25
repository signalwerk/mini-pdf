import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { Writer } from "./index";
import { AstTypesEnum, Document } from "../structure";

const here = path.dirname(fileURLToPath(import.meta.url));
const imageData = fs.readFileSync(
  path.join(here, "../../examples/assets/sample.jpg"),
);

// An AST that exercises every node type: DOCUMENT → FONT + VIEWPORT → IMAGE + TEXT.
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

  // the image node: a DCTDecode XObject painted via a uniquely named resource
  expect(pdf).toContain("/Subtype /Image");
  expect(pdf).toContain("/DCTDecode");
  expect(pdf).toMatch(/\/Im\d+ Do/);

  // document info: an /Info dictionary referenced from the trailer
  expect(pdf).toContain("/Title (mini-pdf)");
  expect(pdf).toMatch(/\/Info \d+ 0 R/);
});
