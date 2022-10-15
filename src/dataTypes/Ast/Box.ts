import { AstTypesEnum } from ".";

export type AstBoxAttributes = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AstBox = {
  type: AstTypesEnum.BOX;
  attributes: AstBoxAttributes;
};
