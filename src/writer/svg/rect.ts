import { AstRect } from "../../dataTypes/ast/Rect";
import { svgStyle } from "./style";

export const svgRect = (rect: AstRect): any => {
  const { x, y, width, height, style, className } = rect.attributes;

  const main = {
    tag: "rect",
    attributes: {
      x,
      y,
      width,
      height,
      className,
      style: style ? svgStyle(style) : {},
    },
  };
  return main;
};
