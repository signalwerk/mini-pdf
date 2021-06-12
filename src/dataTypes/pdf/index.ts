import { PdfTypes } from "../..";
import { PdfReference } from "../reference";

export type PdfPdf = {
  fonts: { [key: string]: PdfReference };
  objects: Array<PdfTypes | null>;
};

export function Pdf(): PdfPdf {
  return {
    fonts: {},
    objects: [],
  };
}
