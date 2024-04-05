import { AstTypesEnum } from ".";
import { AstStyle } from "./Style";

export enum TextAlignEnum {
  DEFAULT = "start",
  START = "start",
  END = "end",
  MIDDLE = "middle",
}

export type AstTextAttributes = {
  x: number;
  y: number;
  // size?: number;
  // font?: string;
  text: string;
  // align?: TextAlignEnum;
  className?: string;
  style?: AstStyle;
};

export type AstText = {
  type: AstTypesEnum.TEXT;
  attributes: AstTextAttributes;
};
