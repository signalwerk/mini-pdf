import Demo from "./demoPDF";

test("general initial test", () => {
  expect(`${Demo()}`).toMatch("Hello World.");
});
