import { convert as convertOfImage } from "../../image";
import { Viewport } from "../../dataTypes/Ast/Viewport";
import { AstTypesEnum, AstTypes } from "../../dataTypes/Ast";
import { pdfArray } from "../../dataTypes/pdf/array";
import { pdfName } from "../../dataTypes/pdf/name";
import { Ref } from "../../dataTypes/pdf/reference";
import { PdfPdf, PdfTypes, PdfType } from "../../dataTypes/pdf";
import {
  PdfDictonary,
  pdfDictionary,
  pdfDictionaryPair,
} from "../../dataTypes/pdf/dictonary";
import { TextLine } from "../../generator/pdf/TextLine";
import { Catalog } from "../../generator/pdf/Catalog";
import { FontHelvetica } from "../../generator/pdf/FontHelvetica";
import { Page } from "../../generator/pdf/Page";
import { Pages } from "../../generator/pdf/Pages";
import { Stream } from "../../dataTypes/pdf/stream";
import { PdfReference } from "../../dataTypes/pdf/reference";
import { SvgSvg } from "../../dataTypes/svg";
import { TextAlignEnum } from "../../dataTypes/Ast/Text";

export const Convert = (obj: AstTypes) => {
  switch (obj.type) {
    case AstTypesEnum.DOCUMENT: {
      // obj.fonts.forEach((font) => {
      //   const { ref: refFont } = addObj(pdf, FontHelvetica(pdfName(font.id)));

      //   pdf.fonts[font.id] = refFont;
      // });
      const page = obj.children[0];

      return Convert(page);
    }
    case AstTypesEnum.VIEWPORT: {
      const SVG = {
        tag: "svg",
        attr: {
          viewBox: obj.attributes.mediaBox.join(" "),
          xmlns: "http://www.w3.org/2000/svg",
        },
        children: [],
      };

      obj.children.forEach((item) => {
        const contentItem = Convert(item);
        SVG.children.push(contentItem);
      });

      return SVG;
    }

    case AstTypesEnum.TEXT: {
      // const textLine = TextLine({
      //   x: obj.attributes.x,
      //   y: obj.attributes.y,
      //   size: obj.attributes.size,
      //   font: obj.attributes.font,
      //   content: obj.attributes.content,
      // });

      let orientation = null;
      if (
        obj.attributes.align &&
        obj.attributes.align !== TextAlignEnum.DEFAULT
      ) {
        orientation = obj.attributes.align;
      }
      return {
        tag: "text",
        attr: {
          x: obj.attributes.position.attributes.x,
          y: obj.attributes.position.attributes.y,
          ...(orientation ? { ["text-anchor"]: orientation } : {}),
        },
        children: [`${obj.attributes.content}`],
      };
    }
    case AstTypesEnum.LINE: {
      // const textLine = TextLine({
      //   x: obj.attributes.x,
      //   y: obj.attributes.y,
      //   size: obj.attributes.size,
      //   font: obj.attributes.font,
      //   content: obj.attributes.content,
      // });

      return {
        tag: "line",

        attr: {
          x1: obj.attributes.start.attributes.x,
          x2: obj.attributes.end.attributes.x,
          y1: obj.attributes.start.attributes.y,
          y2: obj.attributes.end.attributes.y,
          // style: prefs.marks,
        },
      };
    }
  }
};
