import { AstTypesEnum, AstContent } from ".";

export enum AstGroupTransformEnum {
  TRANSLATE = "TRANSLATE",
  SCALE = "SCALE",
}

export type AstGroupTransformTranslate = {
  type: AstGroupTransformEnum.TRANSLATE;
  values: Array<number>;
};
export type AstGroupTransformScale = {
  type: AstGroupTransformEnum.SCALE;
  values: Array<number>;
};

export type AstGroupTransform =
  | AstGroupTransformTranslate
  | AstGroupTransformScale;

export type AstGroupAttributes = {
  transform?: Array<AstGroupTransform>;
};

export type AstGroup = {
  type: AstTypesEnum.GROUP;
  attributes: AstGroupAttributes;
  children: Array<AstContent>;
};
