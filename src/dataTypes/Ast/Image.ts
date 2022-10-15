import { AstTypesEnum } from ".";
import { AstSource } from "./Source";

export type AstImage = {
  type: AstTypesEnum.IMAGE;
  attributes: {
    x: number;
    y: number;
    width: number;
    height: number;
    source: AstSource;
  };
};
