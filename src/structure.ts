import { FixedSizeArray } from "fixed-size-array";

export enum AstTypesEnum {
  DOCUMENT = "DOCUMENT",
  VIEWPORT = "VIEWPORT",
  TEXT = "TEXT",
  TEXTBOX = "TEXTBOX",
  LINE = "LINE",
  BOX = "BOX",
  FONT = "FONT",
  IMAGE = "IMAGE",
}

export type AstTypes =
  | Document
  | Viewport
  | Text
  | TextBox
  | Image
  | Line
  | BoxNode;

export type Document = {
  type: AstTypesEnum.DOCUMENT;
  /** Optional document metadata, written to the PDF `/Info` dictionary. */
  info?: Info;
  fonts: Array<Font>;
  children: Array<Viewport>;
};

/**
 * Document information dictionary (PDF 1.7 §14.3.3 / PDF Reference §9.2.1).
 * Every field is optional; only the ones you set are written. Date fields take
 * a `Date` (formatted to a PDF date string) or a ready-made string such as
 * `"D:19970915110347-08'00'"`.
 */
export type Info = {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date | string;
  modDate?: Date | string;
};

export type Font = {
  type: AstTypesEnum.FONT;
  id: string;
  /** Preferred CSS family name for SVG output. */
  family?: string;
  /** Font weight. SVG uses it directly; built-in PDF fonts use bold at 700+. */
  weight?: number;
  /**
   * Raw bytes of a TrueType/OpenType font to embed. When omitted, the font
   * keeps the original built-in Helvetica behaviour.
   */
  data?: Uint8Array;
};

/** OpenType feature overrides passed to the text shaper. */
export type OpenTypeFeatures =
  | Array<string>
  | { [feature: string]: boolean };

export type Image = {
  type: AstTypesEnum.IMAGE;
  attributes: {
    x: number;
    y: number;
    width: number;
    height: number;
    /**
     * Raw JPEG bytes to embed. The image metadata (color space, bit depth and
     * intrinsic pixel size) is read directly from these bytes, so you only need
     * to provide the placement (`x`, `y`, `width`, `height`) on the page.
     */
    data: Uint8Array;
  };
};

export type Viewport = {
  type: AstTypesEnum.VIEWPORT;
  attributes: {
    mediaBox: Box;
  };
  children: Array<Text | TextBox | Image | Line | BoxNode>;
};

export type MediaBox = FixedSizeArray<4, number>;

/** @deprecated Use `MediaBox` for viewport bounds. */
export type Box = MediaBox;

/** Red, green and blue components normalized to the inclusive range 0–1. */
export type RgbColor = FixedSizeArray<3, number>;

export type Line = {
  type: AstTypesEnum.LINE;
  attributes: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    /** Border width in page units. Defaults to 1. */
    borderWidth?: number;
    /** Border colour. Defaults to black. */
    borderColour?: RgbColor;
  };
};

export type BoxNode = {
  type: AstTypesEnum.BOX;
  attributes: {
    x: number;
    y: number;
    width: number;
    height: number;
    /** Border width in page units. Defaults to 1. */
    borderWidth?: number;
    /** Border colour. Defaults to black. */
    borderColour?: RgbColor;
  };
};

export type Text = {
  type: AstTypesEnum.TEXT;
  attributes: {
    x: number;
    y: number;
    size: number;
    font: string;
    content: string;
    /** Horizontal anchor used by SVG text. Defaults to `start`. */
    textAnchor?: "start" | "middle" | "end";
    /**
     * Optional OpenType feature overrides. Browser-style required/common
     * shaping features (`kern`, `rlig`, `liga`, `clig`, `calt`, `locl`,
     * `ccmp`, `mark`, and `mkmk`) are enabled by default for embedded fonts.
     */
    features?: OpenTypeFeatures;
  };
};

/** A top-left text region that performs word wrapping during rendering. */
export type TextBox = {
  type: AstTypesEnum.TEXTBOX;
  attributes: {
    x: number;
    y: number;
    width: number;
    height: number;
    /** Absolute baseline-to-baseline distance in page units. */
    lineHeight: number;
    size: number;
    font: string;
    content: string;
    textAnchor?: "start" | "middle" | "end";
    features?: OpenTypeFeatures;
  };
};
