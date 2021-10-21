// https://blog.idrsolutions.com/2010/09/understanding-the-pdf-file-format-images/

import * as fs from "fs";
import * as ascii85 from "ascii85";

import { Viewport } from "./dataTypes/Ast/Viewport";
import { ColorSpace } from "./dataTypes/Ast/ColorSpace";
import { Image } from "./dataTypes/Ast/Image";

import { PlainContent } from "./generators/PlainContent";
import { pdfDictionary, pdfDictionaryPair } from "./dataTypes/pdf/dictonary";
import { pdfOperator, PdfOperatorValues } from "./dataTypes/pdf/operator";
import { pdfName } from "./dataTypes/pdf/name";
import { pdfArray } from "./dataTypes/pdf/array";

const ColorSpaceToName = (system: ColorSpace) => {
  switch (system) {
    case ColorSpace.RGB:
      return pdfName("DeviceRGB");
  }
};

export const convert = (obj: Image, viewport: Viewport) => {
  const contentBuff = fs.readFileSync("./data-in/test.jpg");

  const buf = ascii85.encode(contentBuff);

  const content = buf.toString();
  //   let content = "…IMG DATA…";

  // fs.readFile("./data-in/test.jpg", function (err, data) {
  //   if (err) throw err;
  //   // console.log(data.toString());
  //   console.log(data);
  // });

  const refImgNew = [
    pdfDictionary([
      pdfDictionaryPair(pdfName("Type"), pdfName("XObject")),
      pdfDictionaryPair(pdfName("Subtype"), pdfName("Image")),
      pdfDictionaryPair(
        pdfName("BitsPerComponent"),
        obj.attributes.source.depth
      ),
      pdfDictionaryPair(pdfName("Width"), obj.attributes.source.width),
      pdfDictionaryPair(pdfName("Height"), obj.attributes.source.height),
      pdfDictionaryPair(
        pdfName("ColorSpace"),
        ColorSpaceToName(obj.attributes.source.colorSpace)
      ),
      // Pair(Name("Filter"), Name("DCTDecode")),
      pdfDictionaryPair(
        pdfName("Filter"),
        pdfArray([pdfName("ASCII85Decode"), pdfName("DCTDecode")])
      ),
      pdfDictionaryPair(pdfName("Length"), content.length),
    ]),

    pdfOperator(PdfOperatorValues.STREAM_START),
    PlainContent(content),
    pdfOperator(PdfOperatorValues.STREAM_END),
  ];

  const img = [
    pdfOperator(PdfOperatorValues.GRAPHICS_STATE_SAVE),
    pdfOperator(PdfOperatorValues.MATRIX_MODIFY, [
      obj.attributes.width,
      0,
      0,
      obj.attributes.height,
      obj.attributes.x,
      0 +
        (viewport.attributes.mediaBox[3] - viewport.attributes.mediaBox[1]) -
        obj.attributes.height -
        obj.attributes.y,
    ]),
    pdfOperator(PdfOperatorValues.IMAGE_PAINT, [pdfName("I1")]),
    pdfOperator(PdfOperatorValues.GRAPHICS_STATE_RESTORE),
  ];

  return { img, refImgNew };
};

const MARKERS = [
  0xffc0, 0xffc1, 0xffc2, 0xffc3, 0xffc5, 0xffc6, 0xffc7, 0xffc8, 0xffc9,
  0xffca, 0xffcb, 0xffcc, 0xffcd, 0xffce, 0xffcf,
];

export function readMeta(buffer) {
  if (buffer.readUInt16BE(0) !== 0xffd8) {
    throw new Error("SOI not found in JPEG");
  }

  let pos = 2;
  let marker;

  while (pos < buffer.length) {
    marker = buffer.readUInt16BE(pos);
    pos += 2;
    if (MARKERS.includes(marker)) {
      break;
    }
    pos += buffer.readUInt16BE(pos);
  }
  if (!MARKERS.includes(marker)) {
    throw new Error("Invalid JPEG.");
  }

  return {
    depth: buffer[pos + 2],
    width: buffer.readUInt16BE(pos + 5),
    height: buffer.readUInt16BE(pos + 3),
    color: buffer[pos + 7],
  };
}

// https://github.com/riadvice/AlivePDF/blob/master/alivepdf/src/org/alivepdf/images/JPEGImage.as
// export default function getJPEG(buffer) {
//   const meta = readMeta(buffer);
//   const image = {
//     Subtype: "Image",
//     Filter: "DCTDecode",
//     BitsPerComponent: meta.depth,
//     Width: meta.width,
//     Height: meta.height,
//     ColorSpace: `Device${{ 1: "Gray", 3: "RGB", 4: "CMYK" }[meta.color]}`,
//     data: buffer,
//   };
//   return Promise.resolve(image);
// }
