import {
  Writer,
  PdfTypeWriter,
  Dic,
  Name,
  Ref,
  Stream,
  PlainContent,
  Pair,
  Operator,
  Catalog,
  Pages,
  Page,
  FontHelvetica,
  TextLine,
  PdfTypeEnum,
  PdfOperatorEnum,
} from "./index";
import DOC, { Box } from "../data/structure";

test("Minimal one test", () => {
  expect(1).toBe(1);
});

test("general initial test", () => {
  expect(`${Writer(DOC)}`).toMatch("Hello World.");
});

// PdfTypeWriter

test("PdfTypeWriter for string", () => {
  expect(`${PdfTypeWriter("Hello World.")}`).toMatch("(Hello World.)");
});

test("PdfTypeWriter for number", () => {
  expect(`${PdfTypeWriter(5)}`).toMatch("5");
});

test("PdfTypeWriter for array", () => {
  expect(`${PdfTypeWriter(["Hello World.", 3, 0])}`).toMatch(
    "[(Hello World.) 3 0]"
  );
});
test("PdfTypeWriter for minimal dictionary", () => {
  const dic = Dic([Pair(Name("A"), 1)]);

  expect(`${PdfTypeWriter(dic)}`).toMatch("<< /A 1 >>");
});

test("PdfTypeWriter for multi-pair dictionary", () => {
  const dic = Dic([Pair(Name("A"), 1), Pair(Name("B"), 2)]);

  expect(`${PdfTypeWriter(dic)}`).toMatch("<< /A 1\n/B 2 >>");
});

test("PdfTypeWriter for reference", () => {
  const ref = Ref(1, 2);

  expect(`${PdfTypeWriter(ref)}`).toMatch("1 2 R");
});

test("PdfTypeWriter for name", () => {
  const name = Name("Hello");

  expect(`${PdfTypeWriter(name)}`).toMatch("/Hello");
});

test("PdfTypeWriter for stream-content", () => {
  const plainContent = PlainContent("10");

  expect(`${PdfTypeWriter(plainContent)}`).toMatch("10");
});

test("PdfTypeWriter for Operator", () => {
  const operator = Operator(PdfOperatorEnum.TEXT_FONT, [42, "10"]);

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
    Dic([Pair(Name("Type"), Name("Catalog")), Pair(Name("Pages"), pagesRef)])
  );
});

test("Generator for Pages", () => {
  const pagesRef = [Ref(1, 2), Ref(3, 4)];

  const pages = Pages(pagesRef);

  expect(pages).toMatchObject(
    Dic([
      Pair(Name("Type"), Name("Pages")),
      Pair(Name("Count"), 2),
      Pair(Name("Kids"), pagesRef),
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
      Pair(Name("Type"), Name("Page")),
      Pair(Name("Parent"), parent),
      Pair(Name("Resources"), resources),
      Pair(Name("MediaBox"), [...mediaBox] as Array<number>),
      Pair(Name("Contents"), contents),
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

  expect(textLine).toMatchObject(
    Stream([
      Operator(PdfOperatorEnum.TEXT_BEGIN),
      Operator(PdfOperatorEnum.TEXT_FONT, [Name("F1"), 18]),
      Operator(PdfOperatorEnum.TEXT_POSITION, [60, 50]),
      Operator(PdfOperatorEnum.TEXT_PAINT, ["hello world"]),
      Operator(PdfOperatorEnum.TEXT_END),
    ])
  );
});

test("Generator for FontHelvetica", () => {
  const font = FontHelvetica(Name("F1"));

  expect(font).toMatchObject(
    Dic([
      Pair(Name("Type"), Name("Font")),
      Pair(Name("Subtype"), Name("Type1")),
      Pair(Name("Name"), Name("F1")),
      Pair(Name("BaseFont"), Name("Helvetica")),
    ])
  );
});
