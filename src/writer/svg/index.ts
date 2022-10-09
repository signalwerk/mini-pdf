import { Document } from "../../dataTypes/Ast/Document";
// import { pdfName } from "../../dataTypes/pdf/name";
// import { pdfOperator, PdfOperatorValues } from "../../dataTypes/pdf/operator";
// import { pdfDictionary, pdfDictionaryPair } from "../../dataTypes/pdf/dictonary";
// import { PlainContent } from "../../generator/pdf/PlainContent";
// import { Header } from "../../generator/pdf/Header";
// import { PdfTypeWriter } from "./TypeWriter";
// import { Ref } from "../../dataTypes/pdf/reference";
import { Convert } from "./Convert";
import { obj2html } from "./obj2html";
// import { pad } from "../../util/pad";

export const Writer = (doc: Document): string => {
  const svg = Convert(doc);

  return obj2html(svg, { pretty: true });
};
