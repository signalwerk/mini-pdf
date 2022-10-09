import { Box } from "../../../dataTypes/Ast/Box";
import { pdfArray } from "../../../dataTypes/pdf/array";
import { pdfName } from "../../../dataTypes/pdf/name";
import {
  PdfDictonary,
  pdfDictionary,
  pdfDictionaryPair,
} from "../../../dataTypes/pdf/dictonary";
import { PdfReference } from "../../../dataTypes/pdf/reference";

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
