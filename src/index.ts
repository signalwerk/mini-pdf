const fs = require("fs");

import { PdfArray, pdfArrayToString, pdfArray } from "./array";
import { convert as convertOfImage } from "./image";

import {
  Document,
  Box,
  AstTypesEnum,
  AstTypes,
  Viewport,
} from "../data/structure";

const magicNumberHeader = "%¥±ë";

export enum PdfTypeEnum {
  DICTIONARY = "DICTIONARY",
  ARRAY = "ARRAY",
  NAME = "NAME",
  REFRERENCE = "REFRERENCE",
  STREAM = "STREAM",
  PLAIN_CONTENT = "PLAIN_CONTENT",
  OPERATOR = "OPERATOR",
}

export enum PdfOperatorEnum {
  TEXT_FONT = "Tf",
  TEXT_POSITION = "Td",
  TEXT_PAINT = "Tj",
  TEXT_BEGIN = "BT",
  TEXT_END = "ET",
  OBJECT_REFERENCE = "R",
  TRAILER_XREF = "xref",
  TRAILER_START_XREF = "startxref",
  TRAILER_TRAILER = "trailer",
  STREAM_START = "stream",
  STREAM_END = "endstream",
  GRAPHICS_STATE_SAVE = "q",
  GRAPHICS_STATE_RESTORE = "Q",
  MATRIX_MODIFY = "cm", // 4.3.3  Graphics State Operators
  IMAGE_PAINT = "Do",
}

export type PdfOperator = {
  type: PdfTypeEnum.OPERATOR;
  stack: Array<PdfTypes>;
  operator: PdfOperatorEnum;
};

export const Header = (major: number = 1, minor: number = 3) => {
  return `%PDF-${major}.${minor}\n${magicNumberHeader}\n\n`;
};

export type PdfName = {
  type: PdfTypeEnum.NAME;
  value: string;
};

export function pdfName(name: string): PdfName {
  return ({
    type: PdfTypeEnum.NAME,
    value: name,
  });
}

export function pdfNameToString(obj) {
  return `(${obj.replace(/([()])/g, "\\$1")})`;
}

export type PdfStream = {
  type: PdfTypeEnum.STREAM;
  value: Array<PdfType>;
};

export type PdfPlainContent = {
  type: PdfTypeEnum.PLAIN_CONTENT;
  value: PdfTypes;
};

export type PdfReference = {
  type: PdfTypeEnum.REFRERENCE;
  id: number;
  generation: number;
};

export type PdfDictionaryPair = {
  key: PdfName;
  value: PdfTypes;
};
export type PdfDictonary = {
  type: PdfTypeEnum.DICTIONARY;
  pairs: Array<PdfDictionaryPair>;
};

export const Dic = (pairs: Array<PdfDictionaryPair>): PdfDictonary => ({
  type: PdfTypeEnum.DICTIONARY,
  pairs,
});

export const Ref = (id: number, generation: number = 0): PdfReference => ({
  type: PdfTypeEnum.REFRERENCE,
  id,
  generation,
});

export const Stream = (value: Array<PdfType>): PdfStream => ({
  type: PdfTypeEnum.STREAM,
  value,
});

export const PlainContent = (value: string): PdfPlainContent => ({
  type: PdfTypeEnum.PLAIN_CONTENT,
  value,
});

export const Pair = (key: PdfName, value: PdfTypes): PdfDictionaryPair => ({
  key,
  value,
});

export const Operator = (
  operator: PdfOperatorEnum,
  stack?: Array<PdfTypes>
): PdfOperator => ({
  type: PdfTypeEnum.OPERATOR,
  stack: stack || [],
  operator,
});

export type PdfType =
  | PdfDictonary
  | PdfArray
  | PdfReference
  | PdfName
  | PdfOperator
  | PdfStream
  | PdfPlainContent
  | string
  | number;

export type PdfTypes = PdfType | Array<PdfType>;

export const PdfTypeWriter = (obj: PdfTypes): string => {
  switch (typeof obj) {
    case "string":
      return pdfNameToString(obj);
    case "number":
      return `${obj}`;
  }

  // if we have multiple commands just do one after the other
  if (Array.isArray(obj)) {
    return `${obj.map((item) => `${PdfTypeWriter(item)}`).join("\n")}`;
  }

  switch (obj.type) {
    case PdfTypeEnum.DICTIONARY:
      return `<< ${obj.pairs
        .map((kv) => `${PdfTypeWriter(kv.key)} ${PdfTypeWriter(kv.value)}`)
        .join("\n")} >>`;
    case PdfTypeEnum.OPERATOR:
      return `${[
        obj.stack.map((item) => `${PdfTypeWriter(item)}`).join(" "),
        obj.operator,
      ]
        .filter((item) => !!item)
        .join(" ")}`;
    case PdfTypeEnum.NAME:
      return `/${obj.value}`;
    case PdfTypeEnum.ARRAY:
      return pdfArrayToString(obj);
    case PdfTypeEnum.PLAIN_CONTENT:
      return `${obj.value}`;
    case PdfTypeEnum.REFRERENCE:
      return PdfTypeWriter(
        Operator(PdfOperatorEnum.OBJECT_REFERENCE, [obj.id, obj.generation])
      );
    case PdfTypeEnum.STREAM:
      let content = obj.value.map((item) => PdfTypeWriter(item)).join("\n");
      return PdfTypeWriter([
        Dic([Pair(pdfName("Length"), content.length)]),
        Operator(PdfOperatorEnum.STREAM_START),
        PlainContent(content),
        Operator(PdfOperatorEnum.STREAM_END),
      ]);
  }
};

export const Catalog = (pages: PdfReference) => {
  return Dic([
    Pair(pdfName("Type"), pdfName("Catalog")),
    Pair(pdfName("Pages"), pages),
  ]);
};

export const Pages = (pages: Array<PdfReference>) => {
  return Dic([
    Pair(pdfName("Type"), pdfName("Pages")),
    Pair(pdfName("Count"), pages.length),
    Pair(pdfName("Kids"), pdfArray(pages)),
  ]);
};

export const Page = (
  parent: PdfReference,
  resources: PdfReference,
  mediaBox: Box,
  contents: Array<PdfReference>
): PdfDictonary => {
  return Dic([
    Pair(pdfName("Type"), pdfName("Page")),
    Pair(pdfName("Parent"), parent),
    Pair(pdfName("Resources"), resources),
    Pair(pdfName("MediaBox"), pdfArray([...mediaBox] as Array<number>)),
    Pair(pdfName("Contents"), pdfArray(contents)),
  ]);
};

export const FontHelvetica = (name: PdfName): PdfDictonary => {
  return Dic([
    Pair(pdfName("Type"), pdfName("Font")),
    Pair(pdfName("Subtype"), pdfName("Type1")),
    Pair(pdfName("Name"), name),
    Pair(pdfName("BaseFont"), pdfName("Helvetica")),
  ]);
};

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
    Operator(PdfOperatorEnum.TEXT_BEGIN),
    Operator(PdfOperatorEnum.TEXT_FONT, [pdfName(font), size]),
    Operator(PdfOperatorEnum.TEXT_POSITION, [x, y]),
    Operator(PdfOperatorEnum.TEXT_PAINT, [content]),
    Operator(PdfOperatorEnum.TEXT_END),
  ];
};

type Pdf = {
  fonts: { [key: string]: PdfReference };
  objects: Array<PdfTypes | null>;
};

const PDF: Pdf = {
  fonts: {},
  objects: [],
};

const countObj = () => {
  return PDF.objects.length;
};

const addObj = (object: PdfTypes) => {
  const refId = countObj() + 1;

  PDF.objects.push(object);

  return {
    ref: Ref(refId),
  };
};

const replaceObj = (ref: PdfReference, object: PdfTypes) => {
  PDF.objects[ref.id - 1] = object;

  return {
    ref,
  };
};

export const Convert = (
  obj: AstTypes,
  parent?: PdfReference,
  parentObj?: Viewport
) => {
  switch (obj.type) {
    case AstTypesEnum.DOCUMENT:
      const { ref: refCatalog } = addObj(null);
      const { ref: pageInventoryRef } = addObj(null);

      const catalog = Catalog(pageInventoryRef);
      replaceObj(refCatalog, catalog);

      const pagesRef = [];

      obj.fonts.forEach((font) => {
        const { ref: refFont } = addObj(FontHelvetica(pdfName(font.id)));

        PDF.fonts[font.id] = refFont;
      });

      obj.children.forEach((page) => {
        const { ref: refPage } = addObj(null);
        const pageItem = Convert(page, pageInventoryRef) as PdfDictonary;
        pagesRef.push(refPage);
        replaceObj(refPage, pageItem);
      });

      replaceObj(pageInventoryRef, Pages(pagesRef));

      return;

    case AstTypesEnum.VIEWPORT:
      const { ref: refRes } = addObj(null);

      const { ref: refContent } = addObj(null);

      const values = [];
      const fontItems = [];
      const xObjectItems = [];

      obj.children.forEach((item) => {
        const contentItem = Convert(item, refContent, obj) as {
          value: Array<PdfType>;
          fonts?: Array<string>;
          xObjects?: Array<PdfReference>;
        };
        fontItems.push(...contentItem.fonts);
        if (contentItem.value) {
          values.push(...contentItem.value);
        }

        if (contentItem.xObjects) {
          xObjectItems.push(...contentItem.xObjects);
        }
      });
      replaceObj(refContent, Stream(values));

      replaceObj(
        refRes,
        Dic([
          Pair(
            pdfName("ProcSet"),
            pdfArray([
              pdfName("PDF"),
              pdfName("Text"),
              pdfName("ImageB"),
              pdfName("ImageC"),
              pdfName("ImageI"),
            ])
          ),

          Pair(
            pdfName("Font"),
            Dic(fontItems.map((font) => Pair(pdfName(font), PDF.fonts[font])))
          ),
          Pair(
            pdfName("XObject"),
            Dic(xObjectItems.map((xObject) => Pair(pdfName("I1"), xObject)))
          ),
        ])
      );

      const page = Page(parent, refRes, obj.attributes.mediaBox, [refContent]);

      return page;

    case AstTypesEnum.IMAGE:
      const { ref: refImg } = addObj(null);
      // const { ref: refContentItem } = addObj(null);

      const ImgId = "I1";
      const { img, refImgNew } = convertOfImage(obj, parentObj);

      replaceObj(refImg, refImgNew);
      // replaceObj(refContentItem, refContentItemNew);

      return { value: img, xObjects: [refImg] };

    case AstTypesEnum.TEXT:
      const textLine = TextLine({
        x: obj.attributes.x,
        y: obj.attributes.y,
        size: obj.attributes.size,
        font: obj.attributes.font,
        content: obj.attributes.content,
      });

      return { value: textLine, fonts: [obj.attributes.font] };
  }
};

function pad(num: number, size: number) {
  var s = `${num}`;
  while (s.length < size) s = `0${s}`;
  return s;
}

const printDebug = (str: string) => {
  const lines = str.split("\n");

  let offset = 0;
  const outputLines = [];

  lines.forEach((line) => {
    outputLines.push([pad(offset, 10), line].join("   "));
    offset = offset + line.length + 1;
  });

  return outputLines.join("\n");
};

const xrefWriter = (
  offset: number,
  generation: number = 0,
  used: boolean = true
) => {
  return `${pad(offset, 10)} ${pad(generation, 10)} ${used ? "n" : "f"}`;
};

export const Writer = (doc: Document) => {
  Convert(doc);

  let output = [];
  let offset = 0;

  let header = Header();
  output.push(header);
  offset = offset + header.length;

  let xref = [];
  xref.push(xrefWriter(0, 65535, false));

  PDF.objects.forEach((obj, index) => {
    const strObj = `${index + 1} 0 obj\n${PdfTypeWriter(obj)}\nendobj\n`;

    output.push(strObj);
    xref.push(xrefWriter(offset + 1));
    offset = offset + strObj.length + 1;
  });

  const size = PDF.objects.length + 1;

  output.push(PdfTypeWriter(Operator(PdfOperatorEnum.TRAILER_XREF)));
  output.push(PdfTypeWriter(PlainContent(`0 ${size}`)));
  output.push(xref.join("\n"));

  output.push(PdfTypeWriter(Operator(PdfOperatorEnum.TRAILER_TRAILER)));
  output.push(
    PdfTypeWriter(
      Dic([Pair(pdfName("Size"), size), Pair(pdfName("Root"), Ref(1))])
    )
  );

  output.push(PdfTypeWriter(Operator(PdfOperatorEnum.TRAILER_START_XREF)));
  output.push(PdfTypeWriter(PlainContent(`${offset + 1}`)));

  output.push("%%EOF");

  const final = output.join("\n");

  fs.writeFileSync("file.txt", printDebug(final));
  fs.writeFileSync("file.pdf", final);

  return `Hello World.`;
};

const MiniPdf = {
  Writer,
};

// export const TEST = async () => {
//   const { promises: fs } = require("fs");

//   const jpegPath = "./data-in/test.jpg";

//   // const fs = require('fs');

//   // fs.readFile("./data-in/test.jpg", function (err, data) {
//   //   if (err) throw err;
//   //   // console.log(data.toString());
//   //   console.log(data);
//   // });

//   let buffer = await fs.readFile(jpegPath);

//   return { meta: readMeta(buffer) };
// };

export default MiniPdf;
