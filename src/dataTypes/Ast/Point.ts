import { AstTypesEnum } from ".";

export type AstPoint = {
  type: AstTypesEnum.POINT;
  attributes: {
    x: number;
    y: number;
  };
};
