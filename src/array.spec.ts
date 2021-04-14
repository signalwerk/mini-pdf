import { PdfTypeWriter, PdfTypeEnum } from "./index";

import { generator as Arr, toString as ArrToString } from "./array";

test("Generator for PdfArray", () => {
  const value = ["Hello World.", 3, 0];
  expect(Arr(value)).toMatchObject({
    type: PdfTypeEnum.ARRAY,
    value,
  });
});

test("toString for PdfArray", () => {
  expect(`${ArrToString(Arr(["Hello World.", 3, 0]))}`).toMatch(
    "[(Hello World.) 3 0]"
  );
});

test("PdfTypeWriter for PdfArray", () => {
  expect(`${PdfTypeWriter(Arr(["Hello World.", 3, 0]))}`).toMatch(
    `${ArrToString(Arr(["Hello World.", 3, 0]))}`
  );
});
