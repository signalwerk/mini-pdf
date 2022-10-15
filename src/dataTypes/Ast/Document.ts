import { AstTypesEnum } from ".";
import { AstFont } from "./Font";
import { AstViewport } from "./Viewport";

export type AstDocumentAttributes = {
  className?: string;
  fonts?: Array<AstFont>;
};

export type AstDocument = {
  type: AstTypesEnum.DOCUMENT;
  attributes: AstDocumentAttributes;
  children: Array<AstViewport>;
};
