import { AstTypesEnum } from "../../dataTypes/ast";
import { AstLine, AstLineAttributes } from "../../dataTypes/ast/Line";

export const line = (attributes: AstLineAttributes): AstLine => {
  return {
    type: AstTypesEnum.LINE,
    attributes,
  };
};
