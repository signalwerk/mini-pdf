import { PdfName, pdfName } from "../../dataTypes/name";
import {
  PdfDictonary,
  pdfDictionary,
  pdfDictionaryPair,
} from "../../dataTypes/dictonary";

export const FontHelvetica = (name: PdfName, weight = 400): PdfDictonary => {
  return pdfDictionary([
    pdfDictionaryPair(pdfName("Type"), pdfName("Font")),
    pdfDictionaryPair(pdfName("Subtype"), pdfName("Type1")),
    pdfDictionaryPair(pdfName("Name"), name),
    pdfDictionaryPair(
      pdfName("BaseFont"),
      pdfName(weight >= 700 ? "Helvetica-Bold" : "Helvetica"),
    ),
  ]);
};
