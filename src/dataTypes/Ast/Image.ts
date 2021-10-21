import { AstTypesEnum } from ".";
import { Source } from "./Source";


export type Image = {
  type: AstTypesEnum.IMAGE;
  attributes: {
    x: number;
    y: number;
    width: number;
    height: number;
    source: Source;
  };
};
