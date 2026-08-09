// JPEG embedding for mini-pdf.
//
// The raw JPEG bytes travel through the AST (`Image.attributes.data`). The
// image metadata (pixel size, bit depth, color mode) is read straight from the
// JPEG header, so callers only provide the on-page placement. The bytes are
// embedded as a DCTDecode XObject, ASCII85-encoded so the stream stays text.
//
// https://blog.idrsolutions.com/2010/09/understanding-the-pdf-file-format-images/

import ascii85 from "ascii85";

import { Image, Viewport } from "./structure";
import { PlainContent } from "./generators/PlainContent";
import { pdfDictionary, pdfDictionaryPair } from "./dataTypes/dictonary";
import { pdfOperator, PdfOperatorValues } from "./dataTypes/operator";
import { pdfName } from "./dataTypes/name";
import { pdfArray } from "./dataTypes/array";
import { byteLength } from "./util/byteLength";

// --- JPEG inspection (pure, byte-array in → plain data out) -----------------

export type ColorMode = "Gray" | "RGB" | "CMYK";

export type JpegInfo = {
  /** intrinsic width in pixels */
  width: number;
  /** intrinsic height in pixels */
  height: number;
  /** bits per component */
  depth: number;
  /** number of color components */
  components: number;
  /** color mode, derived from the component count */
  colorMode: ColorMode;
};

// SOFn markers that carry frame metadata (precision, size, components).
const SOF_MARKERS = new Set([
  0xffc0, 0xffc1, 0xffc2, 0xffc3, 0xffc5, 0xffc6, 0xffc7, 0xffc8, 0xffc9,
  0xffca, 0xffcb, 0xffcc, 0xffcd, 0xffce, 0xffcf,
]);

const COLOR_MODES: Record<number, ColorMode> = {
  1: "Gray",
  3: "RGB",
  4: "CMYK",
};

// Read a big-endian uint16 straight from the byte array (no Buffer needed).
const u16 = (bytes: Uint8Array, at: number): number =>
  (bytes[at] << 8) | bytes[at + 1];

/**
 * Read the metadata of a JPEG from its raw bytes: dimensions, bit depth and
 * color mode. This is the one parser — `jpegSize` and `jpegColorMode` are thin
 * conveniences on top of it.
 */
export const jpegInfo = (data: Uint8Array): JpegInfo => {
  if (u16(data, 0) !== 0xffd8) {
    throw new Error("Not a JPEG: missing SOI marker.");
  }

  let pos = 2;
  while (pos < data.length) {
    const marker = u16(data, pos);
    pos += 2;

    if (SOF_MARKERS.has(marker)) {
      const components = data[pos + 7];
      const colorMode = COLOR_MODES[components];
      if (!colorMode) {
        throw new Error(`Unsupported JPEG component count: ${components}`);
      }
      return {
        depth: data[pos + 2],
        height: u16(data, pos + 3),
        width: u16(data, pos + 5),
        components,
        colorMode,
      };
    }

    pos += u16(data, pos); // skip this segment by its length
  }

  throw new Error("Invalid JPEG: no start-of-frame marker found.");
};

/** Pixel dimensions of a JPEG. */
export const jpegSize = (
  data: Uint8Array,
): { width: number; height: number } => {
  const { width, height } = jpegInfo(data);
  return { width, height };
};

/** Color mode of a JPEG (`"Gray"`, `"RGB"` or `"CMYK"`). */
export const jpegColorMode = (data: Uint8Array): ColorMode =>
  jpegInfo(data).colorMode;

// --- PDF embedding ----------------------------------------------------------

const DEVICE_COLOR_SPACES: Record<ColorMode, string> = {
  Gray: "DeviceGray",
  RGB: "DeviceRGB",
  CMYK: "DeviceCMYK",
};

/**
 * Build the image XObject and the content-stream operators that paint it.
 *
 * @param obj      the AST image node (carries the raw JPEG bytes + placement)
 * @param viewport the page the image is drawn on (for the coordinate flip)
 * @param name     the resource name the page uses to reference this image
 */
export const convert = (obj: Image, viewport: Viewport, name: string) => {
  const data = obj.attributes.data;
  const info = jpegInfo(data);
  const encoded = ascii85.encode(Buffer.from(data)).toString();
  // PDF ASCII85 streams use the `~>` end-of-data marker (without `<~`).
  // Strip any marker the encoder may already have supplied before appending
  // one, so the stream remains valid if the dependency's behaviour changes.
  const content = `${encoded.replace(/(?:~>)+$/, "")}~>`;

  const imageObject = [
    pdfDictionary([
      pdfDictionaryPair(pdfName("Type"), pdfName("XObject")),
      pdfDictionaryPair(pdfName("Subtype"), pdfName("Image")),
      pdfDictionaryPair(pdfName("BitsPerComponent"), info.depth),
      pdfDictionaryPair(pdfName("Width"), info.width),
      pdfDictionaryPair(pdfName("Height"), info.height),
      pdfDictionaryPair(
        pdfName("ColorSpace"),
        pdfName(DEVICE_COLOR_SPACES[info.colorMode]),
      ),
      pdfDictionaryPair(
        pdfName("Filter"),
        pdfArray([pdfName("ASCII85Decode"), pdfName("DCTDecode")]),
      ),
      pdfDictionaryPair(pdfName("Length"), byteLength(content)),
    ]),

    pdfOperator(PdfOperatorValues.STREAM_START),
    PlainContent(content),
    pdfOperator(PdfOperatorValues.STREAM_END),
  ];

  const mediaBox = viewport.attributes.mediaBox;

  const img = [
    pdfOperator(PdfOperatorValues.GRAPHICS_STATE_SAVE),
    pdfOperator(PdfOperatorValues.MATRIX_MODIFY, [
      obj.attributes.width,
      0,
      0,
      obj.attributes.height,
      obj.attributes.x,
      // PDF's origin is bottom-left, the AST's is top-left: flip y.
      mediaBox[3] - mediaBox[1] - obj.attributes.height - obj.attributes.y,
    ]),
    pdfOperator(PdfOperatorValues.IMAGE_PAINT, [pdfName(name)]),
    pdfOperator(PdfOperatorValues.GRAPHICS_STATE_RESTORE),
  ];

  return { img, imageObject };
};
