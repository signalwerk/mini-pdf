import { PdfTypeEnum, PdfType } from "../../index";


export type PdfStream = {
  type: PdfTypeEnum.STREAM;
  value: Array<PdfType>;
};

export const Stream = (value: Array<PdfType>): PdfStream => ({
  type: PdfTypeEnum.STREAM,
  value,
});
