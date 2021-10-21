import { ColorSpace } from "./ColorSpace";


export type Color = {
  attributes: {
    colorSpace: ColorSpace;
    value: string;
  };
};
