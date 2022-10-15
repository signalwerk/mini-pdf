import { AstColor } from "../../dataTypes/ast/Color";
import { AstColorSpace } from "../../dataTypes/ast/ColorSpace";

export const svgColor = (rect: AstColor): any => {
  const { colorSpace, values } = rect.attributes;

  if (colorSpace === AstColorSpace.NAMED) {
    return values;
  }

  return `${colorSpace}(${values.join(",")})`;
};
