import { AstDocument } from "../../dataTypes/ast/Document";
import { AstTypesEnum } from "../../dataTypes/ast/";
import { AstViewport } from "../../dataTypes/ast/Viewport";
import { AstDocumentAttributes } from "../../dataTypes/ast/Document";

export const document = (
  attributes: AstDocumentAttributes,
  children: Array<AstViewport>
): AstDocument => {
  return {
    type: AstTypesEnum.DOCUMENT,
    attributes,
    children,
  };
};
