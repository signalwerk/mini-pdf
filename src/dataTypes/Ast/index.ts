import { Text } from "./Text";
import { Document } from "./Document";
import { Viewport } from "./Viewport";
import { Image } from "./Image";

export enum AstTypesEnum {
  DOCUMENT = "DOCUMENT",
  VIEWPORT = "VIEWPORT",
  TEXT = "TEXT",
  FONT = "FONT",
  IMAGE = "IMAGE",
  LINE = "LINE",
  POINT = "POINT",
  STYLE = "STYLE",
}

export type AstTypes = Document | Viewport | Text | Image;
