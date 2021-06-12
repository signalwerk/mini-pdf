import { PdfTypeEnum, PdfTypes } from "../../index";

import { PdfTypeWriter } from "../../writer/TypeWriter";
import { PdfName } from "../name";

export type PdfDictionaryPair = {
  key: PdfName;
  value: PdfTypes;
};

export const pdfDictionaryPair = (
  key: PdfName,
  value: PdfTypes
): PdfDictionaryPair => ({
  key,
  value,
});

export function pdfDictionaryPairToString(obj: PdfDictionaryPair) {
  return `${PdfTypeWriter(obj.key)} ${PdfTypeWriter(obj.value)}`;
}

export type PdfDictonary = {
  type: PdfTypeEnum.DICTIONARY;
  pairs: Array<PdfDictionaryPair>;
};

export const pdfDictionary = (
  pairs: Array<PdfDictionaryPair>
): PdfDictonary => ({
  type: PdfTypeEnum.DICTIONARY,
  pairs,
});

export function PdfDictonaryToString(obj: PdfDictonary) {
  return `<< ${obj.pairs
    .map((kv) => pdfDictionaryPairToString(kv))
    .join("\n")} >>`;
}
