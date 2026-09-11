import {
  create as createFont,
  FontKitFont,
  FontKitSubset,
} from "fontkit";

import { OpenTypeFeatures } from "./structure";
import { pdfArray } from "./dataTypes/array";
import {
  PdfDictonary,
  pdfDictionary,
  pdfDictionaryPair,
} from "./dataTypes/dictonary";
import { pdfName } from "./dataTypes/name";
import { pdfOperator, PdfOperatorValues } from "./dataTypes/operator";
import { PdfTypes } from "./dataTypes/pdf";
import { PdfReference } from "./dataTypes/reference";
import { Stream } from "./dataTypes/stream";
import { PlainContent } from "./generators/PlainContent";
import { byteLength } from "./util/byteLength";
import { ascii85Encode } from "./util/ascii85";

export type ShapedGlyph = {
  cid: number;
  xAdvance: number;
  yAdvance: number;
  xOffset: number;
  yOffset: number;
};

const toHex = (value: number, width = 4): string =>
  Math.trunc(value).toString(16).toUpperCase().padStart(width, "0");

const round = (value: number): number =>
  Math.round((value + Number.EPSILON) * 1_000_000) / 1_000_000;

const utf16Hex = (codePoints: Array<number>): string => {
  const units = [];

  codePoints.forEach((originalValue) => {
    let value = originalValue;

    if (
      !Number.isInteger(value) ||
      value < 0 ||
      value > 0x10ffff ||
      (value >= 0xd800 && value <= 0xdfff)
    ) {
      value = 0xfffd;
    }

    if (value > 0xffff) {
      value -= 0x10000;
      units.push(0xd800 | (value >> 10));
      units.push(0xdc00 | (value & 0x3ff));
    } else {
      units.push(value);
    }
  });

  return units.map((unit) => toHex(unit)).join("");
};

const ascii85WithEod = (data: Uint8Array): string =>
  `${ascii85Encode(data)}~>`;

const safePdfName = (value: string): string =>
  value.replace(/[^A-Za-z0-9_.-]/g, "_");

const defaultOpenTypeFeatures = [
  "kern",
  "rlig",
  "liga",
  "clig",
  "calt",
  "locl",
  "ccmp",
  "mark",
  "mkmk",
];

const featureSettings = (features?: OpenTypeFeatures) =>
  Array.isArray(features)
    ? Array.from(new Set([...defaultOpenTypeFeatures, ...features]))
    : {
        ...Object.fromEntries(
          defaultOpenTypeFeatures.map((feature) => [feature, true]),
        ),
        ...(features || {}),
      };

const subsetTag = (index: number): string => {
  let value = Math.max(0, index);
  let suffix = "";

  for (let i = 0; i < 6; i += 1) {
    suffix = String.fromCharCode(65 + (value % 26)) + suffix;
    value = Math.floor(value / 26);
  }

  return suffix;
};

/**
 * Parsed OpenType font plus the document-local subset accumulated while text
 * nodes are converted.
 */
export class EmbeddedFont {
  readonly font: FontKitFont;
  readonly subset: FontKitSubset;
  readonly unitsPerEm: number;
  readonly baseFontName: string;
  readonly isCff: boolean;

  private readonly widths: Array<number>;
  private readonly unicode: Array<Array<number>>;
  private subsetData?: Uint8Array;

  constructor(data: Uint8Array, id: string, index: number) {
    this.font = createFont(data);

    if (!this.font.layout || !this.font.createSubset) {
      throw new Error(
        `Font "${id}" is a collection; provide a single OpenType font face.`,
      );
    }

    if (this.font.directory.tables.CFF2) {
      throw new Error(`Font "${id}" uses unsupported CFF2 outlines.`);
    }

    this.isCff = Boolean(this.font.directory.tables["CFF "]);
    if (!this.isCff && !this.font.directory.tables.glyf) {
      throw new Error(`Font "${id}" has no supported CFF or TrueType outlines.`);
    }

    const embedding = this.font["OS/2"]?.fsType;
    if (embedding?.noEmbedding || embedding?.bitmapOnly) {
      throw new Error(`Font "${id}" does not permit outline embedding.`);
    }
    if (embedding?.noSubsetting) {
      throw new Error(`Font "${id}" does not permit subsetting.`);
    }

    this.subset = this.font.createSubset();
    this.unitsPerEm = this.font.unitsPerEm;

    const name = safePdfName(this.font.postscriptName || id || "EmbeddedFont");
    this.baseFontName = `${subsetTag(index)}+${name}`;

    const missingGlyph = this.font.getGlyph(0);
    this.widths = [this.pdfMetric(missingGlyph.advanceWidth)];
    this.unicode = [[0]];
  }

  /** Shape Unicode text and register every resulting glyph in the subset. */
  shape(text: string, features?: OpenTypeFeatures): Array<ShapedGlyph> {
    if (this.subsetData) {
      throw new Error("Cannot shape text after the font subset was finalized.");
    }

    const run = this.font.layout(text, featureSettings(features));

    return run.glyphs.map((glyph, index) => {
      const cid = this.subset.includeGlyph(glyph.id);
      if (cid > 0xffff) {
        throw new Error("A PDF Type0 font subset cannot exceed 65,536 glyphs.");
      }

      if (this.widths[cid] == null) {
        this.widths[cid] = this.pdfMetric(glyph.advanceWidth);
      }
      if (this.unicode[cid] == null) {
        this.unicode[cid] =
          glyph.codePoints && glyph.codePoints.length > 0
            ? [...glyph.codePoints]
            : [0xfffd];
      }

      const position = run.positions[index];
      return {
        cid,
        xAdvance: position.xAdvance,
        yAdvance: position.yAdvance,
        xOffset: position.xOffset,
        yOffset: position.yOffset,
      };
    });
  }

  /** Measure shaped text in page units without adding glyphs to the subset. */
  measureText(
    text: string,
    size: number,
    features?: OpenTypeFeatures,
  ): number {
    const run = this.font.layout(text, featureSettings(features));
    const advance = run.positions.reduce(
      (width, position) => width + position.xAdvance,
      0,
    );
    return (advance / this.unitsPerEm) * size;
  }

  /** The encoded, PDF-oriented subset. This finalizes the glyph collection. */
  encodeSubset(): Uint8Array {
    if (!this.subsetData) {
      this.subsetData = this.subset.encode();
    }

    return this.subsetData;
  }

  fontFile(): PdfTypes {
    const data = this.encodeSubset();
    const content = ascii85WithEod(data);
    const pairs = [
      pdfDictionaryPair(pdfName("Length"), byteLength(content)),
      pdfDictionaryPair(pdfName("Filter"), pdfName("ASCII85Decode")),
    ];

    if (this.isCff) {
      pairs.push(
        pdfDictionaryPair(pdfName("Subtype"), pdfName("CIDFontType0C")),
      );
    } else {
      pairs.push(pdfDictionaryPair(pdfName("Length1"), data.byteLength));
    }

    return [
      pdfDictionary(pairs),
      pdfOperator(PdfOperatorValues.STREAM_START),
      PlainContent(content),
      pdfOperator(PdfOperatorValues.STREAM_END),
    ];
  }

  descriptor(fontFile: PdfReference): PdfDictonary {
    const bbox = this.font.bbox;
    const pairs = [
      pdfDictionaryPair(pdfName("Type"), pdfName("FontDescriptor")),
      pdfDictionaryPair(pdfName("FontName"), pdfName(this.baseFontName)),
      pdfDictionaryPair(pdfName("Flags"), this.flags()),
      pdfDictionaryPair(
        pdfName("FontBBox"),
        pdfArray([
          this.pdfMetric(bbox.minX),
          this.pdfMetric(bbox.minY),
          this.pdfMetric(bbox.maxX),
          this.pdfMetric(bbox.maxY),
        ]),
      ),
      pdfDictionaryPair(
        pdfName("ItalicAngle"),
        this.font.italicAngle || 0,
      ),
      pdfDictionaryPair(pdfName("Ascent"), this.pdfMetric(this.font.ascent)),
      pdfDictionaryPair(
        pdfName("Descent"),
        this.pdfMetric(this.font.descent),
      ),
      pdfDictionaryPair(
        pdfName("CapHeight"),
        this.pdfMetric(this.font.capHeight || this.font.ascent),
      ),
      pdfDictionaryPair(pdfName("StemV"), 80),
      pdfDictionaryPair(
        pdfName(this.isCff ? "FontFile3" : "FontFile2"),
        fontFile,
      ),
    ];

    if (this.font.xHeight) {
      pairs.splice(
        pairs.length - 1,
        0,
        pdfDictionaryPair(
          pdfName("XHeight"),
          this.pdfMetric(this.font.xHeight),
        ),
      );
    }

    return pdfDictionary(pairs);
  }

  descendantFont(descriptor: PdfReference): PdfDictonary {
    const pairs = [
      pdfDictionaryPair(pdfName("Type"), pdfName("Font")),
      pdfDictionaryPair(
        pdfName("Subtype"),
        pdfName(this.isCff ? "CIDFontType0" : "CIDFontType2"),
      ),
      pdfDictionaryPair(pdfName("BaseFont"), pdfName(this.baseFontName)),
      pdfDictionaryPair(
        pdfName("CIDSystemInfo"),
        pdfDictionary([
          pdfDictionaryPair(pdfName("Registry"), "Adobe"),
          pdfDictionaryPair(pdfName("Ordering"), "Identity"),
          pdfDictionaryPair(pdfName("Supplement"), 0),
        ]),
      ),
      pdfDictionaryPair(pdfName("FontDescriptor"), descriptor),
      pdfDictionaryPair(
        pdfName("W"),
        pdfArray([0, pdfArray(this.widths)]),
      ),
    ];

    if (!this.isCff) {
      pairs.push(
        pdfDictionaryPair(pdfName("CIDToGIDMap"), pdfName("Identity")),
      );
    }

    return pdfDictionary(pairs);
  }

  type0Font(
    descendantFont: PdfReference,
    toUnicode: PdfReference,
  ): PdfDictonary {
    return pdfDictionary([
      pdfDictionaryPair(pdfName("Type"), pdfName("Font")),
      pdfDictionaryPair(pdfName("Subtype"), pdfName("Type0")),
      pdfDictionaryPair(pdfName("BaseFont"), pdfName(this.baseFontName)),
      pdfDictionaryPair(pdfName("Encoding"), pdfName("Identity-H")),
      pdfDictionaryPair(
        pdfName("DescendantFonts"),
        pdfArray([descendantFont]),
      ),
      pdfDictionaryPair(pdfName("ToUnicode"), toUnicode),
    ]);
  }

  toUnicode(): PdfTypes {
    const mappings = this.unicode.map(
      (codePoints, cid) =>
        `<${toHex(cid)}> <${utf16Hex(codePoints || [0xfffd])}>`,
    );
    const chunks = [];

    for (let i = 0; i < mappings.length; i += 100) {
      const entries = mappings.slice(i, i + 100);
      chunks.push(
        `${entries.length} beginbfchar\n${entries.join("\n")}\nendbfchar`,
      );
    }

    const cmap = [
      "/CIDInit /ProcSet findresource begin",
      "12 dict begin",
      "begincmap",
      "/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def",
      "/CMapName /Adobe-Identity-UCS def",
      "/CMapType 2 def",
      "1 begincodespacerange",
      "<0000> <FFFF>",
      "endcodespacerange",
      ...chunks,
      "endcmap",
      "CMapName currentdict /CMap defineresource pop",
      "end",
      "end",
    ].join("\n");

    return Stream([PlainContent(cmap)]);
  }

  private pdfMetric(value: number): number {
    return round((value * 1000) / this.unitsPerEm);
  }

  private flags(): number {
    const familyClass = (this.font["OS/2"]?.sFamilyClass || 0) >> 8;
    let flags = 1 << 2; // Symbolic: the font may contain arbitrary Unicode.

    if (this.font.post?.isFixedPitch) flags |= 1 << 0;
    if (familyClass >= 1 && familyClass <= 7) flags |= 1 << 1;
    if (familyClass === 10) flags |= 1 << 3;
    if (this.font.head?.macStyle?.italic) flags |= 1 << 6;

    return flags;
  }
}

/** Encode a subset CID as the two-byte character code used by Identity-H. */
export const cidHex = (cid: number): string => `<${toHex(cid)}>`;

/** Exposed for focused tests of supplementary Unicode and ligature mappings. */
export const unicodeCodePointsToUtf16Hex = utf16Hex;
