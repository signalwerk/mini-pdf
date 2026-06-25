// mini-pdf demo: one document, every node type.
//
//   npm run demo          render once
//   npm run demo:watch    re-render on every change
//
// Outputs land in examples/output/:
//   - demo.pdf        the generated PDF
//   - demo.debug.txt  the same bytes, each line annotated with its byte offset

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
  Writer,
  printDebug,
  jpegInfo,
  jpegSize,
  jpegColorMode,
  AstTypesEnum,
  Document,
} from "../src/index";

const here = path.dirname(fileURLToPath(import.meta.url));

// Any JPEG works — swap in your own. The metadata is read from the bytes.
const image = fs.readFileSync(path.join(here, "assets/sample.jpg"));

// Inspect the image. `jpegInfo` parses once and returns everything; when you
// only need one fact, `jpegSize` / `jpegColorMode` are focused shortcuts.
const info = jpegInfo(image);
console.log(
  `Image: ${info.width}×${info.height}px, ${info.colorMode}, ${info.depth}-bit`,
);
console.log("  jpegSize      →", jpegSize(image));
console.log("  jpegColorMode →", jpegColorMode(image));

// Fit the image to a target width on the page, keeping its aspect ratio.
const drawWidth = 160;
const drawHeight = Math.round((drawWidth * info.height) / info.width);

const document: Document = {
  type: AstTypesEnum.DOCUMENT,
  // Document metadata → the PDF `/Info` dictionary (all fields optional).
  info: {
    title: "mini-pdf demo",
    author: "mini-pdf",
    subject: "Every node type in one document",
    creator: "mini-pdf",
    producer: "mini-pdf",
    creationDate: new Date(), // a Date is formatted; a string is used as-is
  },
  fonts: [{ type: AstTypesEnum.FONT, id: "F1" }],
  children: [
    {
      type: AstTypesEnum.VIEWPORT,
      attributes: { mediaBox: [0, 0, 300, 260] },
      children: [
        {
          type: AstTypesEnum.IMAGE,
          attributes: {
            x: 20,
            y: 60,
            width: drawWidth,
            height: drawHeight,
            data: image,
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 36,
            size: 24,
            font: "F1",
            content: "mini-pdf",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 240,
            size: 11,
            font: "F1",
            content: `${info.width}×${info.height} ${info.colorMode}`,
          },
        },
      ],
    },
  ],
};

const pdf = Writer(document);

const outDir = path.join(here, "output");
fs.mkdirSync(outDir, { recursive: true });

const pdfPath = path.join(outDir, "demo.pdf");
const debugPath = path.join(outDir, "demo.debug.txt");

fs.writeFileSync(pdfPath, pdf);
fs.writeFileSync(debugPath, printDebug(pdf));

console.log(`Wrote ${path.relative(process.cwd(), pdfPath)}`);
console.log(
  `Wrote ${path.relative(process.cwd(), debugPath)} (byte-offset view)`,
);
