import { PdfTypeEnum, PdfTypes } from "../pdf/index";


export type PdfPlainContent = {
  type: PdfTypeEnum.PLAIN_CONTENT;
  value: PdfTypes;
};
