import { PdfTypeEnum } from "../../";

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

export function pdfStringToString(obj) {
  return `(${obj.value.replace(/([()])/g, "\\$1")})`;
}
