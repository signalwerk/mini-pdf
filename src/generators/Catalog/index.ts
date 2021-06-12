import { pdfName } from "../../dataTypes/name";
import {
  pdfDictionary,
  pdfDictionaryPair
} from "../../dataTypes/dictonary";
import { PdfReference } from "../../dataTypes/reference";


export const Catalog = (pages: PdfReference) => {
  return pdfDictionary([
    pdfDictionaryPair(pdfName("Type"), pdfName("Catalog")),
    pdfDictionaryPair(pdfName("Pages"), pages),
  ]);
};
