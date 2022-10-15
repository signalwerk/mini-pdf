import { AstText } from "./Text";
import { AstDocument } from "./Document";
import { AstViewport } from "./Viewport";
import { AstImage } from "./Image";
import { AstLine } from "./Line";
import { AstRect } from "./Rect";
import { AstGroup } from "./Group";
import { AstPolygon } from "./Polygon";

export enum AstTypesEnum {
  DOCUMENT = "DOCUMENT",
  VIEWPORT = "VIEWPORT",
  TEXT = "TEXT",
  FONT = "FONT",
  IMAGE = "IMAGE",
  LINE = "LINE",
  POINT = "POINT",
  STYLE = "STYLE",
  BOX = "BOX", // just a holder of x,y,width,height
  RECT = "RECT",
  COLOR = "COLOR",
  GROUP = "GROUP",
  POLYGON = "POLYGON",
}

export type AstContent = AstText | AstLine | AstRect | AstGroup | AstPolygon;

export type AstTypes = AstDocument | AstViewport | AstText | AstImage | AstLine;
