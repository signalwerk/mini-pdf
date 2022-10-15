import { AstPolygon } from "../../dataTypes/ast/Polygon";
import { svgStyle } from "./style";

export const svgPolygon = (polygon: AstPolygon): any => {
  const { points, className, style } = polygon.attributes;

  const main = {
    tag: "polygon",
    attributes: {
      points: points.map((item) => `${item.attributes.x},${item.attributes.y}`).join(" "),
      className,
      style: style ? svgStyle(style) : {},
    },
  };
  return main;
};
