import { pdfDate, pdfDateToString, formatPdfDate } from "./index";
import { PdfTypeEnum } from "../pdf";

test("pdfDate wraps a value in a PdfDate object", () => {
  const date = new Date("1999-02-09T15:39:25Z");
  expect(pdfDate(date)).toEqual({ type: PdfTypeEnum.DATE, value: date });
});

test("pdfDateToString formats a Date as a (D:…) literal", () => {
  const str = pdfDateToString(pdfDate(new Date("1999-02-09T15:39:25Z")));
  expect(str).toMatch(/^\(D:\d{14}(Z|[+-]\d{2}'\d{2}')\)$/);
});

test("pdfDateToString passes a ready-made date string through verbatim", () => {
  expect(pdfDateToString(pdfDate("D:19970915110347-08'00'"))).toBe(
    "(D:19970915110347-08'00')",
  );
});

test("formatPdfDate produces a PDF date string body", () => {
  expect(formatPdfDate(new Date("1997-09-15T11:03:47Z"))).toMatch(
    /^D:\d{14}(Z|[+-]\d{2}'\d{2}')$/,
  );
});

test("formatPdfDate zero-pads the year to four digits", () => {
  // local-time constructor, so the YYYYMMDD part is offset-independent
  const result = formatPdfDate(new Date(998, 0, 1, 0, 0, 0));
  expect(result.startsWith("D:0998")).toBe(true);
  expect(result).toMatch(/^D:\d{14}(Z|[+-]\d{2}'\d{2}')$/);
});
