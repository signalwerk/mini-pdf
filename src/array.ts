import { PdfTypeEnum, PdfType, PdfTypeWriter } from "./index";

export type PdfArray = {
  type: PdfTypeEnum.ARRAY;
  value: Array<PdfType>;
};

export const generator = (value: Array<PdfType>): PdfArray => ({
  type: PdfTypeEnum.ARRAY,
  value,
});

export const toString = (obj) =>
  `[${obj.value.map((item) => `${PdfTypeWriter(item)}`).join(" ")}]`;
