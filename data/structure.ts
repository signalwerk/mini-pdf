import { FixedSizeArray } from "fixed-size-array";

export enum AstTypesEnum {
  DOCUMENT = "DOCUMENT",
  VIEWPORT = "VIEWPORT",
  TEXT = "TEXT",
  // LINE = "LINE",
  FONT = "FONT",
  IMAGE = "IMAGE",
}

export type AstTypes = Document | Viewport | Text | Image;

export type Document = {
  type: AstTypesEnum.DOCUMENT;
  fonts: Array<Font>;
  children: Array<Viewport>;
};

export type Font = {
  type: AstTypesEnum.FONT;
  id: string;
};

export enum ColorSpace {
  RGB = "RGB",
}

export type Source = {
  colorSpace: ColorSpace;
  depth: number;
  width: number;
  height: number;
};

export type Image = {
  type: AstTypesEnum.IMAGE;
  attributes: {
    x: number;
    y: number;
    width: number;
    height: number;
    source: Source;
  };
};

export type Viewport = {
  type: AstTypesEnum.VIEWPORT;
  attributes: {
    mediaBox: Box;
  };
  children: Array<Text | Image>;
};

export type Box = FixedSizeArray<4, number>;

// export type Line = {
//   type: AstTypesEnum.LINE;
//   attributes: {
//     x1: number;
//     y1: number;
//     x2: number;
//     y2: number;
//   };
// };
export type Text = {
  type: AstTypesEnum.TEXT;
  attributes: {
    x: number;
    y: number;
    size: number;
    font: string;
    content: string;
  };
};
