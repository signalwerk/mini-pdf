import { AstContent } from "../../dataTypes/ast/";
import { AstTypesEnum } from "../../dataTypes/ast";
import {
  AstGroup,
  AstGroupAttributes,
  AstGroupTransformTranslate,
  AstGroupTransformScale,
  AstGroupTransformEnum,
} from "../../dataTypes/ast/Group";

export const group = (
  attributes: AstGroupAttributes,
  children: Array<AstContent>
): AstGroup => {
  return {
    type: AstTypesEnum.GROUP,
    attributes,
    children: children,
  };
};

export const translate = (x: number, y: number): AstGroupTransformTranslate => {
  return {
    type: AstGroupTransformEnum.TRANSLATE,
    values: [x, y],
  };
};
export const scale = (x: number, y: number): AstGroupTransformScale => {
  return {
    type: AstGroupTransformEnum.SCALE,
    values: [x, y],
  };
};
