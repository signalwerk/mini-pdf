// import { AstTypesEnum } from ".";
// import { AstImage } from "./Image";
// import { AstText } from "./Text";
// import { AstLine } from "./Line";
// import { AstBox } from "./Box";
// import { AstRect } from "./Rect";
//
import { AstTypesEnum } from "../dataTypes/ast/";
import { AstDocument } from "../dataTypes/ast/Document";
import { AstRect } from "../dataTypes/ast/Rect";
import { AstText } from "../dataTypes/ast/Text";
import { AstLine } from "../dataTypes/ast/Line";
import { AstGroup } from "../dataTypes/ast/Group";
import { AstPolygon } from "../dataTypes/ast/Polygon";

import { svgDocument } from "./svg/document";
import { svgRect } from "./svg/rect";
import { svgGroup } from "./svg/group";
import { svgPolygon } from "./svg/polygon";
import { svgText } from "./svg/text";
import { svgLine } from "./svg/line";

export type SvgRenderNodes = Array<
  AstDocument | AstRect | AstText | AstLine | AstGroup | AstPolygon
>;

export const svg = (nodes: SvgRenderNodes): any => {
  return nodes.map((node) => {
    switch (node.type) {
      case AstTypesEnum.DOCUMENT: {
        return svgDocument(node);
      }
      case AstTypesEnum.RECT: {
        return svgRect(node);
      }
      case AstTypesEnum.GROUP: {
        return svgGroup(node);
      }
      case AstTypesEnum.POLYGON: {
        return svgPolygon(node);
      }
      case AstTypesEnum.TEXT: {
        return svgText(node);
      }
      case AstTypesEnum.LINE: {
        return svgLine(node);
      }
    }
  });
};
