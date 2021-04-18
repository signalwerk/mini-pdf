import { PdfTypeEnum } from "../index";


export type PdfName = {
  type: PdfTypeEnum.NAME;
  value: string;
};

export function pdfName(name: string): PdfName {
  return ({
    type: PdfTypeEnum.NAME,
    value: name,
  });
}

export function pdfNameToString(obj) {
  return `(${obj.replace(/([()])/g, "\\$1")})`;
}
