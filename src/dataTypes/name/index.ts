import { PdfTypeEnum } from "../../";

export type PdfName = {
  type: PdfTypeEnum.NAME;
  value: string;
};

export function pdfName(name: string): PdfName {
  return {
    type: PdfTypeEnum.NAME,
    value: name,
  };
}

export function pdfNameToString(obj: PdfName) {
  return `/${obj.value}`;
}
