import { Document } from "../dataTypes/Ast/Document";
import { pdfName } from "../dataTypes/pdf/name";
import { pdfOperator, PdfOperatorValues } from "../dataTypes/pdf/operator";
import { pdfDictionary, pdfDictionaryPair } from "../dataTypes/pdf/dictonary";
import { PdfPdf, Pdf } from "../dataTypes/pdf/";
import { PlainContent } from "../generators/PlainContent";
import { Header } from "../generators/Header";
import { PdfTypeWriter } from "./TypeWriter";
import { Ref } from "../dataTypes/pdf/reference";
import { Convert } from "./Convert";
import { pad } from "../util/pad";

export const xrefWriter = (
  offset: number,
  generation = 0,
  used = true
): string => {
  return `${pad(offset, 10)} ${pad(generation, 10)} ${used ? "n" : "f"}`;
};

export const Writer = (doc: Document): string => {
  const PDF: PdfPdf = Pdf();

  Convert(PDF, doc);

  const output = [];
  let offset = 0;

  const header = Header();
  output.push(header);
  offset = offset + header.length;

  const xref = [];
  xref.push(xrefWriter(0, 65535, false));

  PDF.objects.forEach((obj, index) => {
    const strObj = `${index + 1} 0 obj\n${PdfTypeWriter(obj)}\nendobj\n`;

    output.push(strObj);
    xref.push(xrefWriter(offset + 1));
    offset = offset + strObj.length + 1;
  });

  const size = PDF.objects.length + 1;

  output.push(PdfTypeWriter(pdfOperator(PdfOperatorValues.TRAILER_XREF)));
  output.push(PdfTypeWriter(PlainContent(`0 ${size}`)));
  output.push(xref.join("\n"));

  output.push(PdfTypeWriter(pdfOperator(PdfOperatorValues.TRAILER_TRAILER)));
  output.push(
    PdfTypeWriter(
      pdfDictionary([
        pdfDictionaryPair(pdfName("Size"), size),
        pdfDictionaryPair(pdfName("Root"), Ref(1)),
      ])
    )
  );

  output.push(PdfTypeWriter(pdfOperator(PdfOperatorValues.TRAILER_START_XREF)));
  output.push(PdfTypeWriter(PlainContent(`${offset + 1}`)));

  output.push("%%EOF");

  const final = output.join("\n");

  return final;
};

export const printDebug = (str: string): string => {
  const lines = str.split("\n");

  let offset = 0;
  const outputLines = [];

  lines.forEach((line) => {
    outputLines.push([pad(offset, 10), line].join("   "));
    offset = offset + line.length + 1;
  });

  return outputLines.join("\n");
};
