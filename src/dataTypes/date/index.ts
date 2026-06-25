import { PdfTypeEnum } from "../pdf";

const pad = (n: number, len: number): string => String(n).padStart(len, "0");
const pad2 = (n: number): string => pad(n, 2);

/**
 * Format a `Date` as a PDF date string body, e.g. `D:19970915110347-08'00'`
 * (PDF 1.7 §7.9.4). Uses the date's local timezone offset.
 */
export const formatPdfDate = (date: Date): string => {
  const offset = -date.getTimezoneOffset(); // minutes east of UTC
  const tz =
    offset === 0
      ? "Z"
      : `${offset > 0 ? "+" : "-"}${pad2(Math.floor(Math.abs(offset) / 60))}'${pad2(
          Math.abs(offset) % 60,
        )}'`;

  return (
    "D:" +
    `${pad(date.getFullYear(), 4)}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}` +
    `${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(date.getSeconds())}` +
    tz
  );
};

/**
 * A PDF date object. Serialized as a string literal, e.g.
 * `(D:19970915110347-08'00')`. The value is a `Date` (formatted on write) or a
 * ready-made PDF date string body such as `"D:19970915110347-08'00'"`.
 */
export type PdfDate = {
  type: PdfTypeEnum.DATE;
  value: Date | string;
};

export function pdfDate(value: Date | string): PdfDate {
  return {
    type: PdfTypeEnum.DATE,
    value,
  };
}

export function pdfDateToString(obj: PdfDate): string {
  const body = obj.value instanceof Date ? formatPdfDate(obj.value) : obj.value;
  return `(${body})`;
}
