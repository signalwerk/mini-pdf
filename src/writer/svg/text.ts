import { AstText } from "../../dataTypes/ast/Text";
import { svgStyle } from "./style";

export const svgText = (t: AstText): any => {
  const { x, y, text, className, style } = t.attributes;

  const main = {
    tag: "text",
    attributes: {
      x,
      y,
      className,
      style: style ? svgStyle(style) : {},
    },
    children: text,
  };
  return main;
};
