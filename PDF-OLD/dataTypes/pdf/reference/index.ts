import { PdfTypeEnum } from "..";

export type PdfReference = {
  type: PdfTypeEnum.REFRERENCE;
  id: number;
  generation: number;
};

export const Ref = (id: number, generation = 0): PdfReference => ({
  type: PdfTypeEnum.REFRERENCE,
  id,
  generation,
});
