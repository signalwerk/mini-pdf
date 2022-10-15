import { AstPoint } from "../../dataTypes/ast/Point";
import { AstTypesEnum } from "../../dataTypes/ast/";

export function point(x: number, y: number): AstPoint {
  return {
    type: AstTypesEnum.POINT,
    attributes: {
      x,
      y,
    },
  };
}
