import { AstTypesEnum, AstContent } from ".";
import { AstImage } from "./Image";
import { AstText } from "./Text";
import { AstLine } from "./Line";
import { AstBox } from "./Box";
import { AstRect } from "./Rect";

export type AstViewportAttributes = {
  mediaBox: AstBox;
};

// export type AstViewportChildren = Array<AstText | AstImage | AstLine | AstRect>;
export type AstViewportChildren = Array<AstContent>;

export type AstViewport = {
  type: AstTypesEnum.VIEWPORT;
  attributes: AstViewportAttributes;
  children: AstViewportChildren;
};
