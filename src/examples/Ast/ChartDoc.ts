import { Document } from "../../dataTypes/Ast/Document";
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
          type: AstTypesEnum.LINE,
          attributes: {
            start: {
              type: AstTypesEnum.POINT,
              attributes: {
                x: 50,
                y: 80,
              },
            },
            end: {
              type: AstTypesEnum.POINT,
              attributes: {
                x: 50,
                y: 80,
              },
            },
          },
        },
      ],
    },
  ],
};