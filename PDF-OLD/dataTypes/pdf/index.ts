import { PdfReference } from "./reference";
import { PdfArray } from "./array";
import { PdfName } from "./name";
import { PdfString } from "./string";
import { PdfOperator } from "./operator";
import { PdfDictonary } from "./dictonary";
import { PdfStream } from "./stream";
import { PdfPlainContent } from "./plainContent";

export type PdfPdf = {
  fonts: { [key: string]: PdfReference };
  objects: Array<PdfTypes | null>;
};

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

export function Pdf(): PdfPdf {
  return {
    fonts: {},
    objects: [],
  };
}
