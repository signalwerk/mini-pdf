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

export type Image = {
  type: AstTypesEnum.IMAGE;
  attributes: {
    x: number;
    y: number;
    width: number;
    height: number;
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
            x: 50,
            y: 80,
            width: 100,
            height: 100,
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
