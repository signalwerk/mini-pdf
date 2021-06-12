import { PdfName, pdfName } from "../../dataTypes/name";
import {
  PdfDictonary,
  pdfDictionary,
  pdfDictionaryPair
} from "../../dataTypes/dictonary";


export const FontHelvetica = (name: PdfName): PdfDictonary => {
  return pdfDictionary([
    pdfDictionaryPair(pdfName("Type"), pdfName("Font")),
    pdfDictionaryPair(pdfName("Subtype"), pdfName("Type1")),
    pdfDictionaryPair(pdfName("Name"), name),
    pdfDictionaryPair(pdfName("BaseFont"), pdfName("Helvetica")),
  ]);
};
