import { AstTypesEnum } from "../../dataTypes/ast";
import { AstText, AstTextAttributes } from "../../dataTypes/ast/Text";

export const text = (attributes: AstTextAttributes): AstText => {
  return {
    type: AstTypesEnum.TEXT,
    attributes,
  };
};
