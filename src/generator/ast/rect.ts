import { AstTypesEnum } from "../../dataTypes/ast";
import { AstRect, AstRectAttributes } from "../../dataTypes/ast/Rect";

export const rect = (attributes: AstRectAttributes): AstRect => {
  return {
    type: AstTypesEnum.RECT,
    attributes,
  };
};
