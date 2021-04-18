import { PdfTypeEnum, PdfType, PdfTypeWriter } from "../../";

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

export function pdfArrayToString(obj) {
  return `[${obj.value.map((item) => `${PdfTypeWriter(item)}`).join(" ")}]`;
}
