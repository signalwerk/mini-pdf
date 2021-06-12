import { pdfArray } from "../../dataTypes/array";
import { pdfName } from "../../dataTypes/name";
import {
  pdfDictionary,
  pdfDictionaryPair
} from "../../dataTypes/dictonary";
import { PdfReference } from "../../dataTypes/reference";


export const Pages = (pages: Array<PdfReference>) => {
  return pdfDictionary([
    pdfDictionaryPair(pdfName("Type"), pdfName("Pages")),
    pdfDictionaryPair(pdfName("Count"), pages.length),
    pdfDictionaryPair(pdfName("Kids"), pdfArray(pages)),
  ]);
};
