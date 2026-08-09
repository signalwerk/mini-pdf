declare module "fontkit" {
  export type FontFeatureSettings =
    | Array<string>
    | { [feature: string]: boolean };

  export type FontKitGlyph = {
    id: number;
    codePoints: Array<number>;
    advanceWidth: number;
  };

  export type FontKitGlyphPosition = {
    xAdvance: number;
    yAdvance: number;
    xOffset: number;
    yOffset: number;
  };

  export type FontKitGlyphRun = {
    glyphs: Array<FontKitGlyph>;
    positions: Array<FontKitGlyphPosition>;
  };

  export type FontKitSubset = {
    /** Present when the subset contains CFF outlines. */
    cff?: unknown;
    /** Returns the glyph's remapped ID in the subset. */
    includeGlyph(glyph: number | FontKitGlyph): number;
    encode(): Uint8Array;
  };

  export type FontKitFont = {
    postscriptName?: string;
    unitsPerEm: number;
    ascent: number;
    descent: number;
    capHeight?: number;
    xHeight?: number;
    italicAngle?: number;
    bbox: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
    };
    directory: { tables: { [tag: string]: unknown } };
    post?: { isFixedPitch?: boolean };
    head?: { macStyle?: { italic?: boolean } };
    "OS/2"?: {
      fsType?: {
        noEmbedding?: boolean;
        viewOnly?: boolean;
        editable?: boolean;
        noSubsetting?: boolean;
        bitmapOnly?: boolean;
      };
      sFamilyClass?: number;
    };
    getGlyph(id: number): FontKitGlyph;
    layout(
      text: string,
      features?: FontFeatureSettings,
      script?: string,
      language?: string,
      direction?: string,
    ): FontKitGlyphRun;
    createSubset(): FontKitSubset;
  };

  export function create(
    data: Uint8Array,
    postscriptName?: string,
  ): FontKitFont;
}
