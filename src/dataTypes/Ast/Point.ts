import { AstTypesEnum } from ".";

export type Point = {
  type: AstTypesEnum.POINT;
  attributes: {
    x: number;
    y: number;
  };
};

export function point(x: number, y: number): Point {
  return {
    type: AstTypesEnum.POINT,
    attributes: {
      x,
      y,
    },
  };
}
