import { AstTypesEnum } from ".";
import { AstStyle } from "./Style";
import { AstPoint } from "./Point";

export type AstPolygonAttributes = {
  points: Array<AstPoint>;
  className?: string;
  style?: AstStyle;
};

export type AstPolygon = {
  type: AstTypesEnum.POLYGON;
  attributes: AstPolygonAttributes;
};
