import { Box } from "../../../data/structure";
import { pdfArray } from "../../dataTypes/array";
import { pdfName } from "../../dataTypes/name";
import {
  PdfDictonary,
  pdfDictionary,
  pdfDictionaryPair
} from "../../dataTypes/dictonary";
import { PdfReference } from "../../dataTypes/reference";


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
