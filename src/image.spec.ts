import { PdfTypeWriter } from "./writer/TypeWriter";
import { convert } from "./image";
import { AstTypesEnum, Image, Viewport } from "./structure";

// Minimal SOF0 segment: enough for the metadata reader and ASCII85 encoder.
const jpeg = Uint8Array.from([
  0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x01, 0x00, 0x01, 0x03,
  0x01, 0x11, 0x00, 0x02, 0x11, 0x00, 0x03, 0x11, 0x00,
]);

test("image ASCII85 stream has one EOD marker and a byte-accurate length", () => {
  const image: Image = {
    type: AstTypesEnum.IMAGE,
    attributes: { x: 0, y: 0, width: 1, height: 1, data: jpeg },
  };
  const viewport: Viewport = {
    type: AstTypesEnum.VIEWPORT,
    attributes: { mediaBox: [0, 0, 10, 10] },
    children: [image],
  };
  const serialized = PdfTypeWriter(
    convert(image, viewport, "Im1").imageObject,
  );
  const stream = serialized.match(
    /\/Length (\d+)[\s\S]*?\nstream\n([\s\S]*?)\nendstream/,
  );

  expect(stream).not.toBeNull();
  const content = stream[2];
  expect(content.endsWith("~>")).toBe(true);
  expect(content.match(/~>/g)).toHaveLength(1);
  expect(Number(stream[1])).toBe(Buffer.byteLength(content, "utf8"));
});
