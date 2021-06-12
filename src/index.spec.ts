import { PlainContent } from "./index";
import { Catalog } from "./generators/Catalog";
import { FontHelvetica } from "./generators/FontHelvetica";
import { Page } from "./generators/Page";
import { Pages } from "./generators/Pages";

import { PdfTypeWriter } from "./writer/TypeWriter";

import { Stream } from "./dataTypes/stream";
import { Ref } from "./dataTypes/reference";

import { pdfDictionary, pdfDictionaryPair } from "./dataTypes/dictonary";
import { pdfOperator, PdfOperatorValues } from "./dataTypes/operator";
import { pdfName } from "./dataTypes/name";
import { pdfArray } from "./dataTypes/array";
import { Box } from "../data/structure";

test("Minimal one test", () => {
  expect(1).toBe(1);
});

// PdfTypeWriter

test("PdfTypeWriter for string with escape", () => {
  expect(`${PdfTypeWriter("Hello (World).")}`).toMatch("(Hello \\(World\\).");
});

test("PdfTypeWriter for number", () => {
  expect(`${PdfTypeWriter(5)}`).toMatch("5");
});

test("PdfTypeWriter for reference", () => {
  const ref = Ref(1, 2);

  expect(`${PdfTypeWriter(ref)}`).toMatch("1 2 R");
});

test("PdfTypeWriter for stream-content", () => {
  const plainContent = PlainContent("10");

  expect(`${PdfTypeWriter(plainContent)}`).toMatch("10");
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
    pdfDictionary([
      pdfDictionaryPair(pdfName("Type"), pdfName("Catalog")),
      pdfDictionaryPair(pdfName("Pages"), pagesRef),
    ])
  );
});

test("Generator for Pages", () => {
  const pagesRef = [Ref(1, 2), Ref(3, 4)];

  const pages = Pages(pagesRef);

  expect(pages).toMatchObject(
    pdfDictionary([
      pdfDictionaryPair(pdfName("Type"), pdfName("Pages")),
      pdfDictionaryPair(pdfName("Count"), 2),
      pdfDictionaryPair(pdfName("Kids"), pdfArray(pagesRef)),
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
    pdfDictionary([
      pdfDictionaryPair(pdfName("Type"), pdfName("Page")),
      pdfDictionaryPair(pdfName("Parent"), parent),
      pdfDictionaryPair(pdfName("Resources"), resources),
      pdfDictionaryPair(
        pdfName("MediaBox"),
        pdfArray([...mediaBox] as Array<number>)
      ),
      pdfDictionaryPair(pdfName("Contents"), pdfArray(contents)),
    ])
  );
});

test("Generator for FontHelvetica", () => {
  const font = FontHelvetica(pdfName("F1"));

  expect(font).toMatchObject(
    pdfDictionary([
      pdfDictionaryPair(pdfName("Type"), pdfName("Font")),
      pdfDictionaryPair(pdfName("Subtype"), pdfName("Type1")),
      pdfDictionaryPair(pdfName("Name"), pdfName("F1")),
      pdfDictionaryPair(pdfName("BaseFont"), pdfName("Helvetica")),
    ])
  );
});
