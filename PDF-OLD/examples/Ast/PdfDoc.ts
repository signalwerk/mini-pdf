import { Document } from "../../dataTypes/Ast/Document";
import { ColorSpace } from "../../dataTypes/Ast/ColorSpace";
import { AstTypesEnum } from "../../dataTypes/Ast";

export const DOC: Document = {
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
