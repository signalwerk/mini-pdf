import { PdfArray } from "./dataTypes/array";
import { PdfName } from "./dataTypes/name";
import { PdfString } from "./dataTypes/string";
import { PdfOperator } from "./dataTypes/operator";
import { pad } from "./util/pad";

import {
  PdfDictonary,
} from "./dataTypes/dictonary";

import { Writer } from "./writer/";
import { Ref, PdfReference } from "./dataTypes/reference/";
import { PdfStream } from "./dataTypes/stream";


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

export type PdfPlainContent = {
  type: PdfTypeEnum.PLAIN_CONTENT;
  value: PdfTypes;
};

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

export const addObj = (object: PdfTypes) => {
  const refId = countObj() + 1;

  PDF.objects.push(object);

  return {
    ref: Ref(refId),
  };
};

export const replaceObj = (ref: PdfReference, object: PdfTypes) => {
  PDF.objects[ref.id - 1] = object;

  return {
    ref,
  };
};

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
