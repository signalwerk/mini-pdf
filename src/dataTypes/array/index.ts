import { PdfTypeEnum, PdfType } from "../../dataTypes/pdf";

import { PdfTypeWriter } from "../../writer/TypeWriter";

export type PdfArray = {
  type: PdfTypeEnum.ARRAY;
  value: Array<PdfType>;
};

export function pdfArray(value: Array<PdfType>): PdfArray {
  return {
    type: PdfTypeEnum.ARRAY,
    value,
  };
}

export function pdfArrayToString(obj: PdfArray) {
  return `[${obj.value.map((item) => `${PdfTypeWriter(item)}`).join(" ")}]`;
}
