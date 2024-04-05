import { AstTypesEnum } from ".";
import { AstColorSpace } from "./ColorSpace";

export type AstColorAttributes =
  | AstColorAttributeRGB
  | AstColorAttributeRGBA
  | AstColorAttributeNamed;

export type AstColorAttributeRGB = {
  colorSpace: AstColorSpace.RGB;
  values: Array<number>;
};
export type AstColorAttributeRGBA = {
  colorSpace: AstColorSpace.RGBA;
  values: Array<number>;
};
export type AstColorAttributeNamed = {
  colorSpace: AstColorSpace.NAMED;
  values: string;
};

export type AstColor = {
  type: AstTypesEnum.COLOR;
  attributes: AstColorAttributes;
};
