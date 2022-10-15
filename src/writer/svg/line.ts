import { AstLine } from "../../dataTypes/ast/Line";
import { svgStyle } from "./style";

export const svgLine = (line: AstLine): any => {
  const { x1, x2, y1, y2, style, className } = line.attributes;

  const main = {
    tag: "line",
    attributes: {
      x1,
      y1,
      x2,
      y2,
      className,
      stroke: "black",
      style: style ? svgStyle(style) : {},
    },
  };
  return main;
};
