import { AstTypesEnum } from ".";
import { Font } from "./Font";
import { Viewport } from "./Viewport";

export type Document = {
  type: AstTypesEnum.DOCUMENT;
  fonts: Array<Font>;
  children: Array<Viewport>;
};
