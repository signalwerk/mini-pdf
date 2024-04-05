import { AstTypesEnum } from ".";
import { AstStyle } from "./Style";

export type AstRectAttributes = {
  x: number;
  y: number;
  width: number;
  height: number;
  className?: string;
  style?: AstStyle;
};

export type AstRect = {
  type: AstTypesEnum.RECT;
  attributes: AstRectAttributes;
};
