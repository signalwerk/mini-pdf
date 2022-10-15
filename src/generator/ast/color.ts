import { AstTypesEnum } from "../../dataTypes/ast";
import { AstColor, AstColorAttributes } from "../../dataTypes/ast/Color";
import { AstColorSpace } from "../../dataTypes/ast/ColorSpace";

export const color = (attributes: AstColorAttributes): AstColor => {
  return {
    type: AstTypesEnum.COLOR,
    attributes,
  };
};

export const rgb = (values: Array<number>): AstColor => {
  return color({
    colorSpace: AstColorSpace.RGB,
    values,
  });
};
export const named = (value: string): AstColor => {
  return color({
    colorSpace: AstColorSpace.NAMED,
    values: value,
  });
};

export const BLACK = rgb([0, 0, 0]);
export const RED = rgb([255, 0, 0]);
export const WHITE = rgb([255, 255, 255]);
export const CYAN = rgb([0, 255, 255]);
export const MAGENTA = rgb([255, 0, 255]);
export const TRANSPARENT = named("transparent");
