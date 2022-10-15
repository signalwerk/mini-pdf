import { AstGroup } from "../../dataTypes/ast/Group";
import {
  AstGroupTransform,
  AstGroupTransformEnum,
  AstGroupAttributes,
} from "../../dataTypes/ast/Group";
import { svgStyle } from "./style";
import { svg } from "../svg";

export const svgTransform = (nodes: Array<AstGroupTransform>): any => {
  return nodes.map((node) => {
    switch (node.type) {
      case AstGroupTransformEnum.TRANSLATE: {
        return `translate(${node.values.join(" ")})`;
      }
      case AstGroupTransformEnum.SCALE: {
        return `scale(${node.values.join(" ")})`;
      }
    }
  });
};

export const svgGroup = (group: AstGroup): any => {
  const { type, attributes, children } = group;

  const a: AstGroupAttributes = {};

  if (attributes.transform) {
    a.transform = svgTransform(attributes.transform).join(" ");
  }
  const main = {
    tag: "g",
    attributes: a,
    children: svg(children),
  };
  return main;
};
