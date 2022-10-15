import { PdfPlainContent } from "../../../dataTypes/pdf/plainContent";
import { PdfTypeEnum } from "../../../dataTypes/pdf";

export const PlainContent = (value: string): PdfPlainContent => ({
  type: PdfTypeEnum.PLAIN_CONTENT,
  value,
});
