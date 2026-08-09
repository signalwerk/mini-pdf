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

// Font nodes take the raw bytes of a TrueType/OpenType font. mini-pdf embeds
// only the glyphs used below and shapes every text node as one OpenType run.
const workSansMedium = fs.readFileSync(
  path.join(here, "assets/fonts/Work Sans/WorkSans-Medium.ttf"),
);
const workSansExtraBold = fs.readFileSync(
  path.join(here, "assets/fonts/Work Sans/WorkSans-ExtraBold.ttf"),
);

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
    subject: "Images, embedded fonts, Unicode, kerning, and ligatures",
    creator: "mini-pdf",
    producer: "mini-pdf",
    creationDate: new Date(), // a Date is formatted; a string is used as-is
  },
  fonts: [
    {
      type: AstTypesEnum.FONT,
      id: "WorkSansMedium",
      data: workSansMedium,
    },
    {
      type: AstTypesEnum.FONT,
      id: "WorkSansExtraBold",
      data: workSansExtraBold,
    },
  ],
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
            font: "WorkSansExtraBold",
            content: "mini-pdf",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 240,
            size: 11,
            font: "WorkSansMedium",
            content: `${info.width}×${info.height} ${info.colorMode}`,
          },
        },
      ],
    },
    {
      type: AstTypesEnum.VIEWPORT,
      attributes: { mediaBox: [0, 0, 520, 540] },
      children: [
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 505,
            size: 26,
            font: "WorkSansExtraBold",
            content: "Embedded Work Sans",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 484,
            size: 10,
            font: "WorkSansMedium",
            content: "Medium + ExtraBold · Unicode · OpenType shaping",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 445,
            size: 11,
            font: "WorkSansExtraBold",
            content: "UNICODE",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 418,
            size: 17,
            font: "WorkSansMedium",
            content: "Grüezi Zürich — naïve café · € £ ¥ ©",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 392,
            size: 16,
            font: "WorkSansExtraBold",
            content: "Český Krumlov · Hà Nội · Łódź · Æsir & Œuvre",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 350,
            size: 11,
            font: "WorkSansExtraBold",
            content: "STANDARD LIGATURES",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 323,
            size: 20,
            font: "WorkSansMedium",
            content: "office  affinity  efficient  ffi  fi  fl   (on)",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 294,
            size: 20,
            font: "WorkSansMedium",
            content: "office  affinity  efficient  ffi  fi  fl   (off)",
            features: { liga: false },
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 250,
            size: 11,
            font: "WorkSansExtraBold",
            content: "KERNING COMPARISON",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 225,
            size: 10,
            font: "WorkSansMedium",
            content: "ON (default)",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 190,
            size: 30,
            font: "WorkSansExtraBold",
            content: "AVATAR   WA   To   Yo   Ta  |",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 155,
            size: 10,
            font: "WorkSansMedium",
            content: "OFF ({ kern: false })",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 120,
            size: 30,
            font: "WorkSansExtraBold",
            content: "AVATAR   WA   To   Yo   Ta  |",
            features: { kern: false },
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 20,
            y: 72,
            size: 10,
            font: "WorkSansMedium",
            content:
              "Both rows start at the same x; compare pair spacing and the final |.",
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
