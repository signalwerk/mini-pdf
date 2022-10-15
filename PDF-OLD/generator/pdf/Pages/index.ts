import { pdfArray } from "../../../dataTypes/pdf/array";
import { pdfName } from "../../../dataTypes/pdf/name";
import {
  pdfDictionary,
  pdfDictionaryPair,
} from "../../../dataTypes/pdf/dictonary";
import { PdfReference } from "../../../dataTypes/pdf/reference";

export const Pages = (pages: Array<PdfReference>) => {
  return pdfDictionary([
    pdfDictionaryPair(pdfName("Type"), pdfName("Pages")),
    pdfDictionaryPair(pdfName("Count"), pages.length),
    pdfDictionaryPair(pdfName("Kids"), pdfArray(pages)),
  ]);
};
