// import { PdfReference } from "./reference";
// import { PdfArray } from "./array";
// import { PdfName } from "./name";
// import { PdfString } from "./string";
// import { PdfOperator } from "./operator";
// import { PdfDictonary } from "./dictonary";
// import { PdfStream } from "./stream";
// import { PdfPlainContent } from "./plainContent";
import { TextAlignEnum } from "../Ast/Text";
export type SvgSvg = {
  tag: string;
  children: Array<SvgTypes | null>;
};

export type SvgViewport = {
  tag: string;
  attr: {
    viewBox: string;
    xmlns: string;
  };
  children: Array<SvgTypes | null>;
};

export type SvgText = {
  tag: string;
  attr: {
    x: string;
    y: string;
  };
  ["text-anchor"]: TextAlignEnum;
  children: Array<SvgTypes | null>;
};

export type SvgLine = {
  tag: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

// export enum SvgTypeEnum {
//   DICTIONARY = "DICTIONARY",
//   ARRAY = "ARRAY",
//   NAME = "NAME",
//   REFRERENCE = "REFRERENCE",
//   STREAM = "STREAM",
//   PLAIN_CONTENT = "PLAIN_CONTENT",
//   OPERATOR = "OPERATOR",
//   STRING = "STRING",
// }

export type SvgType = SvgViewport | SvgText | SvgLine | string | number;

export type SvgTypes = Array<SvgType>;

// export function Svg(): SvgSvg {
//   return {
//     tag: "svg",
//     children: [],
//   };
// }
