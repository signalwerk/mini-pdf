import { AstTypesEnum } from ".";
import { Box } from "./Box";
import { Image } from "./Image";
import { Text } from "./Text";
import { Line } from "./Line";

export type Viewport = {
  type: AstTypesEnum.VIEWPORT;
  attributes: {
    mediaBox: Box;
  };
  children: Array<Text | Image | Line>;
};
