import { PdfTypeEnum } from "../../dataTypes/pdf";

export type PdfString = {
  type: PdfTypeEnum.STRING;
  value: string;
};

export function pdfString(value: string): PdfString {
  return {
    type: PdfTypeEnum.STRING,
    value,
  };
}

export function pdfStringToString(obj: PdfString) {
  return `(${obj.value.replace(/([()])/g, "\\$1")})`;
}
