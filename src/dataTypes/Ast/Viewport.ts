import { AstTypesEnum } from ".";
import { Box } from "./Box";
import { Image } from "./Image";
import { Text } from "./Text";


export type Viewport = {
  type: AstTypesEnum.VIEWPORT;
  attributes: {
    mediaBox: Box;
  };
  children: Array<Text | Image>;
};
