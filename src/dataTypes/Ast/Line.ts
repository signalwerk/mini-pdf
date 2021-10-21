import { AstTypesEnum } from ".";
import { Point } from "./Point";
import { Color } from "./Color";

export type Line = {
  type: AstTypesEnum.LINE;
  attributes: {
    start: Point;
    end: Point;
    style?: PathStyle;
  };
};

export enum PathCapEnum {
  ROUND = "ROUND",
}
export enum PathJoinEnum {
  ROUND = "ROUND",
}

export type DashArray = Array<number>;

export type PathStyle = {
  type: AstTypesEnum.STYLE;
  attributes: {
    strokeColor: Color;
    strokeDasharray: DashArray;
    strokeWidth: number;
    strokeLinecap: PathCapEnum;
    strokeLinejoin: PathJoinEnum;
    fill: Color;
  };
};
