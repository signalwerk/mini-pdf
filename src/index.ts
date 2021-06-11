import { convert as convertOfImage } from "./image";

import { Box, AstTypesEnum, AstTypes, Viewport } from "../data/structure";
import { PdfArray, pdfArrayToString, pdfArray } from "./dataTypes/array";
import { PdfName, pdfNameToString, pdfName } from "./dataTypes/name";
import { PdfString, pdfStringToString, pdfString } from "./dataTypes/string";
import {
  PdfOperator,
  pdfOperatorToString,
  pdfOperator,
  PdfOperatorValues,
} from "./dataTypes/operator";

import {
  PdfDictonary,
  PdfDictonaryToString,
  pdfDictionary,
  pdfDictionaryPair,
} from "./dataTypes/dictonary";

import { TextLine } from "./generators/TextLine";
import { Writer } from "./writer/";

const magicNumberHeader = "%¥±ë";

export enum PdfTypeEnum {
  DICTIONARY = "DICTIONARY",
  ARRAY = "ARRAY",
  NAME = "NAME",
  REFRERENCE = "REFRERENCE",
  STREAM = "STREAM",
  PLAIN_CONTENT = "PLAIN_CONTENT",
  OPERATOR = "OPERATOR",
  STRING = "STRING",
}

export const Header = (major: number = 1, minor: number = 3) => {
  return `%PDF-${major}.${minor}\n${magicNumberHeader}\n\n`;
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

export type PdfType =
  | PdfDictonary
  | PdfArray
  | PdfReference
  | PdfName
  | PdfOperator
  | PdfStream
  | PdfString
  | PdfPlainContent
  | string
  | number;

export type PdfTypes = PdfType | Array<PdfType>;

export const PdfTypeWriter = (obj: PdfTypes): string => {
  switch (typeof obj) {
    case "string":
      return PdfTypeWriter(pdfString(obj));
    case "number":
      return `${obj}`;
  }

  // if we have multiple commands just do one after the other
  if (Array.isArray(obj)) {
    return `${obj.map((item) => `${PdfTypeWriter(item)}`).join("\n")}`;
  }

  switch (obj.type) {
    case PdfTypeEnum.DICTIONARY:
      return PdfDictonaryToString(obj);
    case PdfTypeEnum.OPERATOR:
      return pdfOperatorToString(obj);
    case PdfTypeEnum.NAME:
      return pdfNameToString(obj);
    case PdfTypeEnum.STRING:
      return pdfStringToString(obj);
    case PdfTypeEnum.ARRAY:
      return pdfArrayToString(obj);
    case PdfTypeEnum.PLAIN_CONTENT:
      return `${obj.value}`;
    case PdfTypeEnum.REFRERENCE:
      return PdfTypeWriter(
        pdfOperator(PdfOperatorValues.OBJECT_REFERENCE, [
          obj.id,
          obj.generation,
        ])
      );
    case PdfTypeEnum.STREAM:
      let content = obj.value.map((item) => PdfTypeWriter(item)).join("\n");
      return PdfTypeWriter([
        pdfDictionary([pdfDictionaryPair(pdfName("Length"), content.length)]),
        pdfOperator(PdfOperatorValues.STREAM_START),
        PlainContent(content),
        pdfOperator(PdfOperatorValues.STREAM_END),
      ]);
  }
};

export const Catalog = (pages: PdfReference) => {
  return pdfDictionary([
    pdfDictionaryPair(pdfName("Type"), pdfName("Catalog")),
    pdfDictionaryPair(pdfName("Pages"), pages),
  ]);
};

export const Pages = (pages: Array<PdfReference>) => {
  return pdfDictionary([
    pdfDictionaryPair(pdfName("Type"), pdfName("Pages")),
    pdfDictionaryPair(pdfName("Count"), pages.length),
    pdfDictionaryPair(pdfName("Kids"), pdfArray(pages)),
  ]);
};

export const Page = (
  parent: PdfReference,
  resources: PdfReference,
  mediaBox: Box,
  contents: Array<PdfReference>
): PdfDictonary => {
  return pdfDictionary([
    pdfDictionaryPair(pdfName("Type"), pdfName("Page")),
    pdfDictionaryPair(pdfName("Parent"), parent),
    pdfDictionaryPair(pdfName("Resources"), resources),
    pdfDictionaryPair(
      pdfName("MediaBox"),
      pdfArray([...mediaBox] as Array<number>)
    ),
    pdfDictionaryPair(pdfName("Contents"), pdfArray(contents)),
  ]);
};

export const FontHelvetica = (name: PdfName): PdfDictonary => {
  return pdfDictionary([
    pdfDictionaryPair(pdfName("Type"), pdfName("Font")),
    pdfDictionaryPair(pdfName("Subtype"), pdfName("Type1")),
    pdfDictionaryPair(pdfName("Name"), name),
    pdfDictionaryPair(pdfName("BaseFont"), pdfName("Helvetica")),
  ]);
};

type Pdf = {
  fonts: { [key: string]: PdfReference };
  objects: Array<PdfTypes | null>;
};

export const PDF: Pdf = {
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
        pdfDictionary([
          pdfDictionaryPair(
            pdfName("ProcSet"),
            pdfArray([
              pdfName("PDF"),
              pdfName("Text"),
              pdfName("ImageB"),
              pdfName("ImageC"),
              pdfName("ImageI"),
            ])
          ),

          pdfDictionaryPair(
            pdfName("Font"),
            pdfDictionary(
              fontItems.map((font) =>
                pdfDictionaryPair(pdfName(font), PDF.fonts[font])
              )
            )
          ),
          pdfDictionaryPair(
            pdfName("XObject"),
            pdfDictionary(
              xObjectItems.map((xObject) =>
                pdfDictionaryPair(pdfName("I1"), xObject)
              )
            )
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

export const printDebug = (str: string) => {
  const lines = str.split("\n");

  let offset = 0;
  const outputLines = [];

  lines.forEach((line) => {
    outputLines.push([pad(offset, 10), line].join("   "));
    offset = offset + line.length + 1;
  });

  return outputLines.join("\n");
};

export const xrefWriter = (
  offset: number,
  generation: number = 0,
  used: boolean = true
) => {
  return `${pad(offset, 10)} ${pad(generation, 10)} ${used ? "n" : "f"}`;
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
