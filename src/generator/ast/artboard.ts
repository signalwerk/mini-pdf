import { AstTypesEnum } from "../../dataTypes/ast";
import { AstViewport } from "../../dataTypes/ast/Viewport";
import { AstViewportChildren } from "../../dataTypes/ast/Viewport";

export const artboard = (
  width: number,
  height: number,
  children: AstViewportChildren
): AstViewport => {
  return {
    type: AstTypesEnum.VIEWPORT,
    attributes: {
      mediaBox: {
        type: AstTypesEnum.BOX,
        attributes: {
          x: 0,
          y: 0,
          width,
          height,
        },
      },
    },
    children,
  };
};
