const fs = require("fs");
import { Document } from "../../data/structure";
import { pdfName } from "../dataTypes/name";
import {
  pdfOperator,
  PdfOperatorValues
} from "../dataTypes/operator";
import {
  pdfDictionary,
  pdfDictionaryPair
} from "../dataTypes/dictonary";
import { Convert, Header, xrefWriter, PDF, PdfTypeWriter, PlainContent, Ref, printDebug } from "../index";


export const Writer = (doc: Document) => {
  Convert(doc);

  let output = [];
  let offset = 0;

  let header = Header();
  output.push(header);
  offset = offset + header.length;

  let xref = [];
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

  fs.writeFileSync("file.txt", printDebug(final));
  fs.writeFileSync("file.pdf", final);

  return `Hello World.`;
};
