import { AstTypesEnum } from ".";
import { AstStyle } from "./Style";

export type AstLineAttributes = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  className?: string;
  style?: AstStyle;
};

export type AstLine = {
  type: AstTypesEnum.LINE;
  attributes: AstLineAttributes;
};
