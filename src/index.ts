const fs = require("fs");

import { PdfArray, toString as ArrToString, generator as Arr } from "./array";

import { Document, Box, AstTypesEnum, AstTypes } from "../data/structure";

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

export const Name = (name: string): PdfName => ({
  type: PdfTypeEnum.NAME,
  value: name,
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
      return `(${obj.replace(/([()])/g, "\\$1")})`;

    case "number":
      return `${obj}`;
  }

  if (Array.isArray(obj)) {
    console.log("error", obj);
    return `[${obj.map((item) => `${PdfTypeWriter(item)}`).join(" ")}]`;
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
      return ArrToString(obj);
    case PdfTypeEnum.PLAIN_CONTENT:
      return `${obj.value}`;
    case PdfTypeEnum.REFRERENCE:
      return PdfTypeWriter(
        Operator(PdfOperatorEnum.OBJECT_REFERENCE, [obj.id, obj.generation])
      );
    case PdfTypeEnum.STREAM:
      let content = obj.value.map((item) => PdfTypeWriter(item)).join("\n");
      return [
        PdfTypeWriter(Dic([Pair(Name("Length"), content.length)])),
        PdfTypeWriter(Operator(PdfOperatorEnum.STREAM_START)),
        PdfTypeWriter(PlainContent(content)),
        PdfTypeWriter(Operator(PdfOperatorEnum.STREAM_END)),
      ].join("\n");
  }
};

export const Catalog = (pages: PdfReference) => {
  return Dic([Pair(Name("Type"), Name("Catalog")), Pair(Name("Pages"), pages)]);
};

export const Pages = (pages: Array<PdfReference>) => {
  return Dic([
    Pair(Name("Type"), Name("Pages")),
    Pair(Name("Count"), pages.length),
    Pair(Name("Kids"), Arr(pages)),
  ]);
};

export const Page = (
  parent: PdfReference,
  resources: PdfReference,
  mediaBox: Box,
  contents: Array<PdfReference>
): PdfDictonary => {
  return Dic([
    Pair(Name("Type"), Name("Page")),
    Pair(Name("Parent"), parent),
    Pair(Name("Resources"), resources),
    Pair(Name("MediaBox"), Arr([...mediaBox] as Array<number>)),
    Pair(Name("Contents"), Arr(contents)),
  ]);
};

export const FontHelvetica = (name: PdfName): PdfDictonary => {
  return Dic([
    Pair(Name("Type"), Name("Font")),
    Pair(Name("Subtype"), Name("Type1")),
    Pair(Name("Name"), name),
    Pair(Name("BaseFont"), Name("Helvetica")),
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
}): PdfStream => {
  return Stream([
    Operator(PdfOperatorEnum.TEXT_BEGIN),
    Operator(PdfOperatorEnum.TEXT_FONT, [Name(font), size]),
    Operator(PdfOperatorEnum.TEXT_POSITION, [x, y]),
    Operator(PdfOperatorEnum.TEXT_PAINT, [content]),
    Operator(PdfOperatorEnum.TEXT_END),
  ]);
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

export const Convert = (obj: AstTypes, parent?: PdfReference) => {
  switch (obj.type) {
    case AstTypesEnum.DOCUMENT:
      const { ref: refCatalog } = addObj(null);
      const { ref: pageInventoryRef } = addObj(null);

      const catalog = Catalog(pageInventoryRef);
      replaceObj(refCatalog, catalog);

      const pagesRef = [];

      obj.fonts.forEach((font) => {
        const { ref: refFont } = addObj(FontHelvetica(Name(font.id)));

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

      const mediaBox: Box = [0, 1, 10, 20];
      //   const contents = [Ref(4, 5), Ref(6, 7)];

      const contentItems = [];
      const fontItems = [];

      obj.children.forEach((item) => {
        const { ref: refContentItem } = addObj(null);
        const contentItem = Convert(item, refContentItem) as {
          value: PdfStream;
          fonts: Array<string>;
        };
        fontItems.push(...contentItem.fonts);
        replaceObj(refContentItem, contentItem.value);

        contentItems.push(refContentItem);
      });

      replaceObj(
        refRes,
        Dic([
          Pair(
            Name("Font"),
            Dic(fontItems.map((font) => Pair(Name(font), PDF.fonts[font])))
          ),
        ])
      );

      const page = Page(parent, refRes, obj.attributes.mediaBox, contentItems);

      return page;

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
    PdfTypeWriter(Dic([Pair(Name("Size"), size), Pair(Name("Root"), Ref(1))]))
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

export default MiniPdf;
