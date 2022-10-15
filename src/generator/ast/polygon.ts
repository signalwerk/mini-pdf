import { AstTypesEnum } from "../../dataTypes/ast";
import { AstPolygon, AstPolygonAttributes } from "../../dataTypes/ast/Polygon";
import { AstPoint } from "../../dataTypes/ast/Point";
import { point } from "./point";

// convert array of objects to array of AstPoint
export const pointsFromArrOfObj = (
  points: Array<{ x: number; y: number }> | undefined
): Array<AstPoint> => {
  if (!points) {
    return [];
  }
  return points.map((point) => pointFromObj(point));
};

export const pointFromObj = (
  p: { x: number; y: number } | undefined
): AstPoint => {
  if (!p) {
    return point(0, 0);
  }
  return point(p.x, p.y);
};

export const polygon = (attributes: AstPolygonAttributes): AstPolygon => {
  return {
    type: AstTypesEnum.POLYGON,
    attributes,
  };
};
