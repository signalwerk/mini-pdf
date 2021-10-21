import { pdfName } from "../../dataTypes/pdf/name";
import {
  pdfDictionary,
  pdfDictionaryPair
} from "../../dataTypes/pdf/dictonary";
import { PdfReference } from "../../dataTypes/pdf/reference";


export const Catalog = (pages: PdfReference) => {
  return pdfDictionary([
    pdfDictionaryPair(pdfName("Type"), pdfName("Catalog")),
    pdfDictionaryPair(pdfName("Pages"), pages),
  ]);
};
