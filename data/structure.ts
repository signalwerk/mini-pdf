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

const DOC: Document = {
  type: AstTypesEnum.DOCUMENT,
  fonts: [
    {
      type: AstTypesEnum.FONT,
      id: "F1",
    },
  ],
  children: [
    {
      type: AstTypesEnum.VIEWPORT,
      attributes: {
        mediaBox: [0, 0, 300, 144],
      },
      children: [
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 50,
            y: 50,
            size: 18,
            font: "F1",
            content: "next hello world",
          },
        },
        {
          type: AstTypesEnum.TEXT,
          attributes: {
            x: 50,
            y: 80,
            size: 18,
            font: "F1",
            content: "hello world",
          },
        },
        {
          type: AstTypesEnum.IMAGE,
          attributes: {
            x: 10,
            y: 5,
            width: 120,
            height: 66,
            source: {
              colorSpace: ColorSpace.RGB,
              depth: 8,
              width: 1200,
              height: 660,
            },
          },
        },
        // {
        //   type: AstTypesEnum.LINE,
        //   attributes: {
        //     x1: 0,
        //     y1: 0,
        //     x2: 0,
        //     y2: 0,
        //     // stroke: "black",
        //     // strokeWidth: 1,
        //   },
        // },
      ],
    },
  ],
};

export default DOC;
