import { InfoDictionary } from "./index";
import { PdfTypeWriter } from "../../writer/TypeWriter";

test("Info dictionary writes only the fields that are set", () => {
  const str = `${PdfTypeWriter(
    InfoDictionary({ title: "My Doc", author: "Me", creator: "mini-pdf" }),
  )}`;

  expect(str).toContain("/Title (My Doc)");
  expect(str).toContain("/Author (Me)");
  expect(str).toContain("/Creator (mini-pdf)");
  expect(str).not.toContain("/Producer");
  expect(str).not.toContain("/CreationDate");
});

test("Info dictionary escapes parentheses in string values", () => {
  const str = `${PdfTypeWriter(InfoDictionary({ title: "A (B) C" }))}`;
  expect(str).toContain("/Title (A \\(B\\) C)");
});

test("Info dictionary passes ready-made PDF date strings through verbatim", () => {
  const str = `${PdfTypeWriter(
    InfoDictionary({ creationDate: "D:19970915110347-08'00'" }),
  )}`;
  expect(str).toContain("/CreationDate (D:19970915110347-08'00')");
});

test("Info dictionary formats Date values as PDF dates", () => {
  const str = `${PdfTypeWriter(
    InfoDictionary({ modDate: new Date("1999-02-09T15:39:25Z") }),
  )}`;
  expect(str).toMatch(/\/ModDate \(D:\d{14}(Z|[+-]\d{2}'\d{2}')\)/);
});
