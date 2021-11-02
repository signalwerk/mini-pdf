import { pdfArrayToString } from "../../dataTypes/pdf/array";
import { pdfNameToString, pdfName } from "../../dataTypes/pdf/name";
import { pdfStringToString, pdfString } from "../../dataTypes/pdf/string";
import {
  pdfOperatorToString,
  pdfOperator,
  PdfOperatorValues,
} from "../../dataTypes/pdf/operator";
import {
  PdfDictonaryToString,
  pdfDictionary,
  pdfDictionaryPair,
} from "../../dataTypes/pdf/dictonary";
import { PdfTypes, PdfTypeEnum } from "../../dataTypes/pdf";
import { PlainContent } from "../../generator/pdf/PlainContent";

export const PdfTypeWriter = (obj: PdfTypes): string => {
  switch (typeof obj) {
    case "string":
      return PdfTypeWriter(pdfString(obj));
    case "number":
      return `${obj}`;
  }

  // if we have multiple commands just do one after the other
  if (Array.isArray(obj)) {
    return `${obj.map((item) => `${PdfTypeWriter(item)}`).join("\n")}`;
  }

  switch (obj.type) {
    case PdfTypeEnum.DICTIONARY:
      return PdfDictonaryToString(obj);
    case PdfTypeEnum.OPERATOR:
      return pdfOperatorToString(obj);
    case PdfTypeEnum.NAME:
      return pdfNameToString(obj);
    case PdfTypeEnum.STRING:
      return pdfStringToString(obj);
    case PdfTypeEnum.ARRAY:
      return pdfArrayToString(obj);
    case PdfTypeEnum.PLAIN_CONTENT:
      return `${obj.value}`;
    case PdfTypeEnum.REFRERENCE:
      return PdfTypeWriter(
        pdfOperator(PdfOperatorValues.OBJECT_REFERENCE, [
          obj.id,
          obj.generation,
        ])
      );
    case PdfTypeEnum.STREAM: {
      const content = obj.value.map((item) => PdfTypeWriter(item)).join("\n");
      return PdfTypeWriter([
        pdfDictionary([pdfDictionaryPair(pdfName("Length"), content.length)]),
        pdfOperator(PdfOperatorValues.STREAM_START),
        PlainContent(content),
        pdfOperator(PdfOperatorValues.STREAM_END),
      ]);
    }
  }
};