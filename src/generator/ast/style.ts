import { AstTypesEnum } from "../../dataTypes/ast";
import { AstStyle, AstStyleAttributes } from "../../dataTypes/ast/Style";

export const style = (attributes: AstStyleAttributes): AstStyle => {
  return {
    type: AstTypesEnum.STYLE,
    attributes,
  };
};
