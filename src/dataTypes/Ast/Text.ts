import { AstTypesEnum } from ".";
import { Point } from "./Point";

// export type Line = {
//   type: AstTypesEnum.LINE;
//   attributes: {
//     x1: number;
//     y1: number;
//     x2: number;
//     y2: number;
//   };
// };

export enum TextAlignEnum {
  DEFAULT = "start",
  START = "start",
  END = "end",
  MIDDLE = "middle",
}

export type Text = {
  type: AstTypesEnum.TEXT;
  attributes: {
    position: Point;
    size?: number;
    font?: string;
    content: string;
    align?: TextAlignEnum;
  };
};
