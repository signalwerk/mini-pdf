import { PdfTypeEnum, PdfType, PdfTypeWriter } from "../../";

export type PdfArray = {
  type: PdfTypeEnum.ARRAY;
  value: Array<PdfType>;
};

export const pdfArray = (value: Array<PdfType>): PdfArray => ({
  type: PdfTypeEnum.ARRAY,
  value,
});

export const pdfArrayToString = (obj) =>
  `[${obj.value.map((item) => `${PdfTypeWriter(item)}`).join(" ")}]`;
