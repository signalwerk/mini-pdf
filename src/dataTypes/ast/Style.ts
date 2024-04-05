import { AstTypesEnum } from ".";
import { AstColor } from "./Color";

export enum AstPathCapEnum {
  ROUND = "ROUND",
}
export enum AstPathJoinEnum {
  ROUND = "ROUND",
}

export type AstDashArray = Array<number>;

export type AstStyleAttributes = {
  stroke?: AstColor;
  strokeDasharray?: AstDashArray;
  strokeWidth?: number;
  strokeLinecap?: AstPathCapEnum;
  strokeLinejoin?: AstPathJoinEnum;
  fill?: AstColor;
  vectorEffect?: string;
};

export type AstStyle = {
  type: AstTypesEnum.STYLE;
  attributes: AstStyleAttributes;
};
