import {
  Writer,
  PdfTypeWriter,
  Dic,
  Ref,
  Stream,
  PlainContent,
  Pair,
  PdfOperator,
  Catalog,
  Pages,
  Page,
  FontHelvetica,
  TextLine,
  PdfTypeEnum,
  PdfOperatorEnum,
  PdfReference,
} from "./index";
import { pdfName } from "./name";

import { pdfArray } from "./array";

import DOC, { Box } from "../data/structure";

test("Minimal one test", () => {
  expect(1).toBe(1);
});

test("general initial test", () => {
  expect(`${Writer(DOC)}`).toMatch("Hello World.");
});

// PdfTypeWriter

test("PdfTypeWriter for string with escape", () => {
  expect(`${PdfTypeWriter("Hello (World).")}`).toMatch("(Hello \\(World\\).");
});

test("PdfTypeWriter for number", () => {
  expect(`${PdfTypeWriter(5)}`).toMatch("5");
});

test("PdfTypeWriter for minimal dictionary", () => {
  const dic = Dic([Pair(pdfName("A"), 1)]);

  expect(`${PdfTypeWriter(dic)}`).toMatch("<< /A 1 >>");
});

test("PdfTypeWriter for multi-pair dictionary", () => {
  const dic = Dic([Pair(pdfName("A"), 1), Pair(pdfName("B"), 2)]);

  expect(`${PdfTypeWriter(dic)}`).toMatch("<< /A 1\n/B 2 >>");
});

test("PdfTypeWriter for reference", () => {
  const ref = Ref(1, 2);

  expect(`${PdfTypeWriter(ref)}`).toMatch("1 2 R");
});

test("PdfTypeWriter for stream-content", () => {
  const plainContent = PlainContent("10");

  expect(`${PdfTypeWriter(plainContent)}`).toMatch("10");
});

test("PdfTypeWriter for Operator", () => {
  const operator = PdfOperator(PdfOperatorEnum.TEXT_FONT, [42, "10"]);

  expect(`${PdfTypeWriter(operator)}`).toMatch("42 (10) Tf");
});

const visualize = (str: string) => str.replace(/ /g, "-").split("\n").join("⏎");

test("PdfTypeWriter for stream", () => {
  const stream = Stream([10]);

  expect(`${PdfTypeWriter(stream)}`).toMatch(
    ["<< /Length 2 >>", "stream", "10", "endstream"].join("\n")
  );
});

test("Generator for Catalog", () => {
  const pagesRef = Ref(1, 2);

  const catalog = Catalog(pagesRef);

  expect(catalog).toMatchObject(
    Dic([
      Pair(pdfName("Type"), pdfName("Catalog")),
      Pair(pdfName("Pages"), pagesRef),
    ])
  );
});

test("Generator for Pages", () => {
  const pagesRef = [Ref(1, 2), Ref(3, 4)];

  const pages = Pages(pagesRef);

  expect(pages).toMatchObject(
    Dic([
      Pair(pdfName("Type"), pdfName("Pages")),
      Pair(pdfName("Count"), 2),
      Pair(pdfName("Kids"), pdfArray(pagesRef)),
    ])
  );
});

test("Generator for Page", () => {
  const parent = Ref(1, 2);
  const resources = Ref(10, 0);
  const mediaBox: Box = [0, 1, 10, 20];
  const contents = [Ref(4, 5), Ref(6, 7)];

  const page = Page(parent, resources, mediaBox, contents);

  expect(page).toMatchObject(
    Dic([
      Pair(pdfName("Type"), pdfName("Page")),
      Pair(pdfName("Parent"), parent),
      Pair(pdfName("Resources"), resources),
      Pair(pdfName("MediaBox"), pdfArray([...mediaBox] as Array<number>)),
      Pair(pdfName("Contents"), pdfArray(contents)),
    ])
  );
});
test("Generator for TextLine", () => {
  const textLine = TextLine({
    x: 60,
    y: 50,
    size: 18,
    font: "F1",
    content: "hello world",
  });

  expect(textLine).toMatchObject([
    PdfOperator(PdfOperatorEnum.TEXT_BEGIN),
    PdfOperator(PdfOperatorEnum.TEXT_FONT, [pdfName("F1"), 18]),
    PdfOperator(PdfOperatorEnum.TEXT_POSITION, [60, 50]),
    PdfOperator(PdfOperatorEnum.TEXT_PAINT, ["hello world"]),
    PdfOperator(PdfOperatorEnum.TEXT_END),
  ]);
});

test("Generator for FontHelvetica", () => {
  const font = FontHelvetica(pdfName("F1"));

  expect(font).toMatchObject(
    Dic([
      Pair(pdfName("Type"), pdfName("Font")),
      Pair(pdfName("Subtype"), pdfName("Type1")),
      Pair(pdfName("Name"), pdfName("F1")),
      Pair(pdfName("BaseFont"), pdfName("Helvetica")),
    ])
  );
});
