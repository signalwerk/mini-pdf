import { Text } from "./Text";
import { Document } from "./Document";
import { Viewport } from "./Viewport";
import { Image } from "./Image";


export enum AstTypesEnum {
  DOCUMENT = "DOCUMENT",
  VIEWPORT = "VIEWPORT",
  TEXT = "TEXT",
  // LINE = "LINE",
  FONT = "FONT",
  IMAGE = "IMAGE"
}

export type AstTypes = Document | Viewport | Text | Image;
