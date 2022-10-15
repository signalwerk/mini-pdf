import { PdfTypeEnum, PdfTypes } from "..";

export type PdfPlainContent = {
  type: PdfTypeEnum.PLAIN_CONTENT;
  value: PdfTypes;
};
