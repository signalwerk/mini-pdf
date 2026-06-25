import { Writer, printDebug } from "./writer/";
import { jpegInfo, jpegSize, jpegColorMode } from "./image";

const MiniPdf = {
  Writer,
  printDebug,
  jpegInfo,
  jpegSize,
  jpegColorMode,
};

export default MiniPdf;
export { Writer, printDebug };
export { jpegInfo, jpegSize, jpegColorMode } from "./image";
export type { JpegInfo, ColorMode } from "./image";
export * from "./structure";
