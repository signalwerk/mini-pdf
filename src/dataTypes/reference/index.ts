import { PdfTypeEnum } from "../../dataTypes/pdf";

export type PdfReference = {
  type: PdfTypeEnum.REFRERENCE;
  id: number;
  generation: number;
};

export const Ref = (id: number, generation: number = 0): PdfReference => ({
  type: PdfTypeEnum.REFRERENCE,
  id,
  generation,
});
